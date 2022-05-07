/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var fotoPerfil = document.getElementById("fotoPerfilNav");
fotoPerfil.onerror = () => {
    fotoPerfil.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
    console.log("ha fallado")
}

var btnVisibility = document.getElementById("visibility");
var divBtnVisibility = document.getElementById("divVisibility");
divBtnVisibility.onclick = () => {

    if (btnVisibility.value == 0) {
        btnVisibility.value = 1;
    } else {
        btnVisibility.value = 0;
    }

};

var drag = document.getElementsByClassName(".file-input");

drag.onchange = function () {


    var filesCount = $(this)[0].files.length;

    var textbox = $(this).prev();

    if (filesCount === 1) {
        var fileName = $(this).val().split('\\').pop();
        textbox.text(fileName);
    } else {
        textbox.text(filesCount + ' files selected');
    }
};