/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


const fotoPerfil = document.getElementById("fotoPerfilNav");
const drag = document.getElementsByClassName(".file-input");
const btnVisibility = document.getElementById("visibility");
const divBtnVisibility = document.getElementById("divVisibility");
const fechaHoy = document.getElementById("fechaHoy");
const fechaFinalizacion = document.getElementById("fechaFinalizacion");
const idTarea = document.getElementById("idTarea");

const today = new Date();

fechaHoy.value = parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());

fotoPerfil.onerror = () => {
    fotoPerfil.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
    console.log("ha fallado")
}

divBtnVisibility.onclick = () => {

    if (btnVisibility.value == 0) {
        btnVisibility.value = 1;
    } else {
        btnVisibility.value = 0;
    }

};


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


function parseDate(data) {

    var myDate = new Date(data);

    var myDateString = myDate.getFullYear() + "-";

    if (myDate.getMonth().toString().length == 1) {

        myDateString += ("0" + (myDate.getMonth() + 1) + "-");
    } else {

        myDateString += ((myDate.getMonth() + 1) + "-");
    }
    if (myDate.getDate().toString().length == 1) {

        myDateString += ("0" + myDate.getDate());

    } else {
        myDateString += myDate.getDate();
    }

    return myDateString;
}

function generatePushID() {
    var PUSH_CHARS = 'º/\\ª$%&()=¡!+¨`´{}-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    var lastPushTime = 0;
    var lastRandChars = [];

    var now = new Date().getTime();
    var duplicateTime = (now === lastPushTime);
    lastPushTime = now;

    var timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
        timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
        now = Math.floor(now / 64);
    }
    if (now !== 0)
        throw new Error('We should have converted the entire timestamp.');

    var id = timeStampChars.join('');

    if (!duplicateTime) {
        for (i = 0; i < 12; i++) {
            lastRandChars[i] = Math.floor(Math.random() * 64);
        }
    } else {
        for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
            lastRandChars[i] = 0;
        }
        lastRandChars[i]++;
    }
    for (i = 0; i < 12; i++) {
        id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    if (id.length != 20) {
        throw new Error('Length should be 20.');
    }
    return id;
}


idTarea.innerHTML = generatePushID();

