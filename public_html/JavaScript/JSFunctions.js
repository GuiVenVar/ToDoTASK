/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { firebase, analytics, auth, db, storage} from "./Connection/BBDDFunctions.js"


export  function parseDate(stringData) {

    var myDate = new Date(stringData);

    var myDateString = myDate.getFullYear() + "-";

    if (myDate.getMonth().toString().length == 1) {

        myDateString += "0" + (myDate.getMonth() + 1) + "-";
    } else {

        myDateString += (myDate.getMonth() + 1) + "-";
    }
    if (myDate.getDate().toString().length == 1) {

        myDateString += ("0" + myDate.getDate());

    } else {
        myDateString += myDate.getDate();
    }
    return myDateString;
}

export function generateToast(titulo, descripcion, fecha, tiempoEjecucion) {
    var myToast = document.getElementById("toast");
    var myToastCabecera = document.getElementById("toastTextoCabecera");
    var myToastBody = document.getElementById("toastText");
    var myToastTimer = document.getElementById("toastTiempoToast");
    var myToastBtnCerrar = document.getElementById("toastBtnCerrar");

    myToastBtnCerrar.onclick = () => {
        myToast.style.display = "none";
    };


    myToast.style.display = "block";
    myToast.style.backgroundColor = "rgba(255,255,255,1)";
    myToastCabecera.innerText = titulo;
    myToastBody.innerText = descripcion;
    myToastTimer.innerHTML = fecha;
    myToastTimer.value = new Date().getDate();

    /**
     * 
     * Si en 3 segundos no hemos reaccionado , se cierra.
     */
    setTimeout(function () {
        myToast.style.display = "none";
    }
    , tiempoEjecucion);
}

export function generatePushID() {
    var PUSH_CHARS = '_-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
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