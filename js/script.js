/**
 * Created by Kim on 08.08.2015.
 */


var model = {
    init: function () {
        if (!localStorage["catlist"]) {
            this.catlist = [
                {name: "Maria",         file: "second_cat.jpg",                    clicks: 0},
                {name: "Lucy",          file: "1280px-Neugierige-Katze.JPG",       clicks: 0},
                {name: "Kedi",          file: "Kedi-dili.jpg",                     clicks: 0},
                {name: "Gato",          file: "Gato_común_latinoamericano.JPG",    clicks: 0},
                {name: "Marcy",         file: "laptop_cat.jpg",                    clicks: 0},
                {name: "Pluto",         file: "screaming_kitten.jpg",              clicks: 0},
                {name: "Paul and Lisa", file: "twocats.jpg",                       clicks: 0},
                {name: "Gingeria",      file: "Ginger_Kitten_Face.JPG",            clicks: 0}
            ];
        } else {
            this.catlist = JSON.parse(localStorage.getItem("catlist"));
        }
        this.currentCat = 0;
        this.adminMode = false;
    },
    setCurrentCatData: function (catnumber) {
        this.currentCat = catnumber;
    },
    getCurrentCatData: function () {
        return this.catlist[this.currentCat];
    },
    incrementCatCounter : function () {
        this.catlist[this.currentCat].clicks+=1;
        model.saveCatsToLocalStorage();
    },
    getCatList: function () {
        return this.catlist;
    },
    enableAdminMode: function () {
        this.adminMode = true;
    },
    disableAdminMode: function() {
        this.adminMode = false;
    },
    setCurrentCatProperties: function(name, url, clicks) {
        var currentCat = this.catlist[this.currentCat];
           currentCat["name"]=name;
           currentCat["file"]=url;
           currentCat["clicks"]=clicks;
        model.saveCatsToLocalStorage();
    },
    saveCatsToLocalStorage: function () {
        localStorage.setItem("catlist", JSON.stringify(this.catlist));
    }
};

var controller = {
    init : function () {
        model.init();
        catdetailview.init();
        catlistview.init();
        adminview.init();
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
            adminview.render();
        });
    },

    addCatButtonClickListener: function (button, catName) {
        button.click(function () {
            model.setCurrentCatData(catName);
            catdetailview.render();
            adminview.render();
        })
    },

    addAdminButtonClickListener: function (adminButton) {
        adminButton.click(function () {
            model.enableAdminMode();
            adminview.render();
        });
    },

    addCancelButtonClickListener: function (cancelButton) {
        cancelButton.click(function () {
            model.disableAdminMode();
            adminview.render();
        });
    },

    addSaveButtonClickListener: function (saveButton) {
        saveButton.click( function () {
            var catName = adminview.catNameInput.prop("value");
            var catURL = adminview.catURLInput.prop("value");
            var catClicks = parseInt(adminview.catClickInput.prop("value"));
            model.setCurrentCatProperties(catName, catURL, catClicks);
            catdetailview.render();
            model.disableAdminMode();
            adminview.render();
            catlistview.render();
        });
    },

    getAdminMode: function () {
        return model.adminMode;
    }
 };

var catdetailview = {
    init: function () {
        this.catdisplay = $("#cat_detaildisplay");
        var catHTML = "<p>Catclicks for <span id='cat_name'></span>: <span id='cat_clicks'></span></p>" +
            "<img id='cat_image' src='' width='400'>";
        this.catdisplay.append(catHTML);
        this.catName = $("#cat_name");
        this.catClicks = $("#cat_clicks");
        this.catImage = $("#cat_image");
        controller.addCatImageClickListener(this.catImage);
        catdetailview.render();
    },
    render: function () {
        var currentCat = controller.getCurrentCat();
        this.catName.text(currentCat.name);
        this.catClicks.text(currentCat.clicks);
        this.catImage.attr("src", 'img/' + currentCat.file);
    }
};

var catlistview = {
    init: function () {
        var cats = controller.getCatList();
        var catHTML = [];
        for (c in cats) {
            var catName = cats[c].name;
            var newButton = $("<button id='" + c + "'></button>");
            controller.addCatButtonClickListener(newButton, c);
            catHTML.push(newButton);
        }
        $("#cat_listview").append(catHTML);
        catlistview.render();
    },
    render: function () {
        var cats = controller.getCatList();
        for (c in cats) {
            var button = $("#" + c);
            button.text(cats[c].name);
        }
    }
};

var adminview = {
    init: function () {
        this.adminButton = $("#admin_button");
        this.adminSection = $("#admin_section");
        this.cancelButton = $("#admin_cancel");
        this.saveButton = $("#admin_save");
        this.catNameInput = $("#admin_name");
        this.catURLInput = $("#admin_url");
        this.catClickInput = $("#admin_clicks");
        controller.addAdminButtonClickListener(this.adminButton);
        controller.addCancelButtonClickListener(this.cancelButton);
        controller.addSaveButtonClickListener(this.saveButton);
        adminview.render();
    },
    render: function () {
        if (controller.getAdminMode()) {
            this.adminSection.attr("style", "display:inline");
            var currentCat = controller.getCurrentCat();
            this.catNameInput.prop("value", currentCat.name);
            this.catURLInput.prop("value", currentCat.file);
            this.catClickInput.prop("value", currentCat.clicks);
        } else {
            $(this.adminSection).attr("style", "display:none")
        }
    }
};

controller.init();