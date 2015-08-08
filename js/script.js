/**
 * Created by Kim on 08.08.2015.
 */


var model = {
    init: function () {
        this.catlist = {
            Maria:      {name: "Maria",       file: "second_cat.jpg",                    clicks: 0},
            Lucy:       {name: "Lucy",        file: "1280px-Neugierige-Katze.JPG",       clicks: 0},
            Kedi:       {name: "Kedi",        file: "Kedi-dili.jpg",                     clicks: 0},
            Gato:       {name: "Gato",        file: "Gato_común_latinoamericano.JPG",    clicks: 0},
            Gingeria:   {name: "Gingeria",    file: "Ginger_Kitten_Face.JPG",            clicks: 0}
        };
        this.currentCat = Object.keys(this.catlist).pop();
    },
    setCurrentCatData: function (catname) {
        this.currentCat = catname;
    },
    getCurrentCatData: function () {
        return this.catlist[this.currentCat];
    },
    incrementCatCounter : function () {
        this.catlist[this.currentCat].clicks+=1;
    },
    getCatList: function () {
        return Object.keys(this.catlist);
    }
};

var controller = {
    init : function () {
        model.init();
        catdetailview.init();
        catlistview.init();
    },

    getCurrentCat: function () {
      return model.getCurrentCatData();
    },

    getCatList: function () {
      return model.getCatList();
    },

    addCatImageClickListener: function (catImage) {
        catImage.click(function () {
            model.incrementCatCounter();
            catdetailview.render();
        });
    },

    addCatButtonClickListener: function (button, catName) {
        button.click(function () {
            model.setCurrentCatData(catName);
            catdetailview.render();
        })
    }
};

var catdetailview = {
    init: function () {
        this.catdisplay = $("#cat_detaildisplay");
        var catHTML = "<p>Catclicks for <span id='cat_name'></span>: <span id='cat_clicks'></span></p>" +
            "<img id='cat_image' src='' width='400'>";
        this.catdisplay.append(catHTML);
        controller.addCatImageClickListener($("#cat_image"));
        catdetailview.render();
    },
    render: function () {
        var currentCat = controller.getCurrentCat();
        $("#cat_name").text(currentCat.name);
        $("#cat_clicks").text(currentCat.clicks);
        $("#cat_image").attr("src", 'img/' + currentCat.file);
    }
};

var catlistview = {
    init: function () {
        var cats = controller.getCatList();
        var catHTML = [];
        for (c in cats) {
            var cat = cats[c];
            var newButton = $("<button>" + cat + "</button>");
            controller.addCatButtonClickListener(newButton, cat);
            catHTML.push(newButton);
        }
        $("#cat_listview").append(catHTML);
    }
};


controller.init();