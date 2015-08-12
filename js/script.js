/**
 * Created by Kim on 08.08.2015.
 */


var model = {
    init: function () {
        if (!(localStorage["catlist"] && localStorage["currentCat"])) {
            this.catlist = [
                {name: "Maria",         file: "img/second_cat.jpg",                    clicks: 0},
                {name: "Lucy",          file: "img/1280px-Neugierige-Katze.JPG",       clicks: 0},
                {name: "Kedi",          file: "img/Kedi-dili.jpg",                     clicks: 0},
                {name: "Gato",          file: "img/Gato_común_latinoamericano.JPG",    clicks: 0},
                {name: "Marcy",         file: "img/laptop_cat.jpg",                    clicks: 0},
                {name: "Pluto",         file: "img/screaming_kitten.jpg",              clicks: 0},
                {name: "Paul and Lisa", file: "img/twocats.jpg",                       clicks: 0},
                {name: "Gingeria",      file: "img/Ginger_Kitten_Face.JPG",            clicks: 0}
            ];
            this.currentCat = 2;
        } else {
            model.readCatsFromLocalStorage();
        }
        this.adminMode = false;
    },
    setCurrentCatData: function (catnumber) {
        this.currentCat = catnumber;
        model.saveCatsToLocalStorage();
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
        localStorage.setItem("currentCat", JSON.stringify(this.currentCat));
    },
    readCatsFromLocalStorage: function() {
        this.catlist = JSON.parse(localStorage.getItem("catlist"));
        this.currentCat = JSON.parse(localStorage.getItem("currentCat"));
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

    getCurrentCatNumber: function () {
        return model.currentCat;
    },

    getCatList: function () {
      return model.getCatList();
    },

    addCatImageClickListener: function (catImage) {
        catImage.click(function () {
            model.incrementCatCounter();
            catdetailview.render();
            adminview.render();
            catdetailview.catImage.popover('destroy');
        });
    },

    addCatButtonClickListener: function (button, catName) {
        button.click(function () {
            model.setCurrentCatData(catName);
            catdetailview.render();
            adminview.render();
            catlistview.render();
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
    },

    addResetLocalStorageClickListener: function (resetButton) {
        resetButton.click(function () {
            localStorage.clear();
            location.reload();
        })
    },
    removeInputEnterListener: function () {
        $('.admin-form').find('input').keydown(function(event){
            if(event.keyCode == 13) {
                event.preventDefault();
                adminview.saveButton.trigger('click');
                return false;
            }
        });
    },
 };

var catdetailview = {
    init: function () {
        this.catdisplay = $("#cat_detaildisplay");
        var catHTML = "<h4>Catclicks for <span id='cat_name'></span>: <span id='cat_clicks'></span></h4>" +
            "<img id='cat_image' src='' width='400' data-toggle='popover' data-trigger='manual'" +
            "data-placement='top' title='Howto'" +
            "data-content='Click on your favourite cat to increase its Catclicks!'>";
        this.catdisplay.append(catHTML);
        this.catName = $("#cat_name");
        this.catClicks = $("#cat_clicks");
        this.catImage = $("#cat_image");
        controller.addCatImageClickListener(this.catImage);
        catdetailview.render();
        setTimeout(function(){
            if (adminview.adminSection.is(":hidden")) catdetailview.catImage.popover('show');
        }, 3000);
    },
    render: function () {
        var currentCat = controller.getCurrentCat();
        this.catName.text(currentCat.name);
        this.catClicks.text(currentCat.clicks);
        this.catImage.attr("src", currentCat.file);
    }
};

var catlistview = {
    init: function () {
        var cats = controller.getCatList();
        var catHTML = [];
        for (c in cats) {
            var catName = cats[c].name;
            var newButton = $("<li><a href='#' id='" + c + "'></a></li>");
            controller.addCatButtonClickListener(newButton, c);
            catHTML.push(newButton);
        }
        $("#cat_listview").append(catHTML);
        catlistview.closeMenuWhenItemSelected();
        catlistview.render();
    },
    render: function () {
        var cats = controller.getCatList();
        for (c in cats) {
            var link = $("#" + c);
            link.text(cats[c].name);
            link.parent().attr("class", "");
        }
        this.setActiveCatLink();
    },
    setActiveCatLink: function() {
        var currentCatNumber = controller.getCurrentCatNumber();
        $("#"+currentCatNumber).parent().attr("class", "active");
    },
    closeMenuWhenItemSelected: function() {
        $(".navbar-nav li a").click(function(event) {
            $(".navbar-collapse").collapse('hide');
        });
    }
};

var adminview = {
    init: function () {
        this.adminButton = $("#admin_button");
        this.adminSection = $("#admin_section");
        this.cancelButton = $("#admin_cancel");
        this.saveButton = $("#admin_save");
        this.resetButton = $("#localstorage_reset");
        this.catNameInput = $("#admin_name");
        this.catURLInput = $("#admin_url");
        this.catClickInput = $("#admin_clicks");
        controller.addAdminButtonClickListener(this.adminButton);
        controller.addCancelButtonClickListener(this.cancelButton);
        controller.addSaveButtonClickListener(this.saveButton);
        controller.addResetLocalStorageClickListener(this.resetButton);
        controller.removeInputEnterListener();
        adminview.render();
    },
    render: function () {
        if (controller.getAdminMode()) {
            this.adminSection.show();
            var currentCat = controller.getCurrentCat();
            this.catNameInput.prop("value", currentCat.name);
            this.catURLInput.prop("value", currentCat.file);
            this.catClickInput.prop("value", currentCat.clicks);
            catdetailview.catdisplay.hide()
        } else {
            $(this.adminSection).hide();
            catdetailview.catdisplay.show();
        }
    }
};

controller.init();