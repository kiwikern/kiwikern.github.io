/**
 * Created by Kim on 08.08.2015.
 */


//functions
function addCatClickListener(catname) {
    var catpic = $("#" + catname + "pic");
    catpic.click(function () {
        var catclicknumber = $("#" + catname + "number");
        catclicknumber.text(parseInt(catclicknumber.text())+1);})
}

function addNewCat(catname, filename) {
    var newCatHTML = "<div id='" + catname + "' style='display:none'><p>Catclicks for " + catname + ": <span id='" + catname + "number'>0</span></p>" +
        "<img id='" + catname + "pic' src='img/" + filename + "' width='400'></div>";
    $("#cats").append(newCatHTML);
}

function addCatListItem(catname) {
    var catList = $("#catlist");
    var newListItem = "<li id='" + catname + "list" + "'>" + catname + "</li>";
    catList.append(newListItem);
}

function addCatListItemClickListener(catname) {
    var catListItem = $("#" + catname + "list");
    catListItem.click(function() {
       $("#cats > div").attr("style", "display:none");
        $("#" + catname).attr("style", "display:inline")
    });
}

//doStuff
var catlist = [
    {name: "Maria", file: "second_cat.jpg"},
    {name: "Lucy", file: "1280px-Neugierige-Katze.JPG"},
    {name: "Kedi", file: "Kedi-dili.jpg"},
    {name: "Gato", file: "Gato_común_latinoamericano.JPG"},
    {name: "Gingeria", file: "Ginger_Kitten_Face.JPG"}
];
for (f in catlist) {
    var name = catlist[f].name;
    var file = catlist[f].file;
    addNewCat(name, file);
    addCatClickListener(name);
    addCatListItem(name);
    addCatListItemClickListener(name);
}
