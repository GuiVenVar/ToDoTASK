/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import { ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { firebase, analytics, auth, db, storage, UserSignOut, loadProfilePicture, loadTask, changeData} from "../Connection/BBDDFunctions.js";
import { parseDate,parseHour, generateToast, generatePushID, preventCodeInjection} from "../JSFunctions.js";
import { Tareas } from "../Models/Tareas.js";
import { Usuarios } from "../Models/Usuarios.js";


const fotoPerfil = document.getElementById("fotoPerfilNav");
const btnSignOut = document.getElementById("signOut");


var today = new Date();

/**
 * 
 * Le añadimos un dia mas a la fecha de finalizacion y al dia de hoy que no se pueda modificar
 */
const btnVisibility = document.getElementById("visibility");
const labelIdTarea = document.getElementById("idTarea");
const inputTituloTarea = document.getElementById("tituloTarea");
const inputDescripcionTarea = document.getElementById("descripcionTarea");
const btnCreate = document.getElementById("btnCreate");
const divBtnVisibility = document.getElementById("divVisibility");
const selectPrioridad = document.getElementById("selectPrioridad");
const fechaHoy = document.getElementById("fechaHoy");
const fechaFinalizacion = document.getElementById("fechaFinalizacion");
const horaCreacion = document.getElementById("horaCreacion");

var snapFechaFin = "";
var snapVisibility = "";
var snapTitulo = "";
var snapDescripcion = "";
var snapPrioridad = "";

fechaHoy.min = parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
fechaFinalizacion.min = parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + (today.getDate() + 1));


var getURL = window.location.href;

auth.onAuthStateChanged(function (user) {
    if (user) {


        loadProfilePicture(document.getElementById("fotoPerfilNav"));

        if (getURL.includes("?")) {

            loadTask(getURL.split("?")[1],
                    document.getElementById("visibility"),
                    document.getElementById("fechaHoy"),
                    document.getElementById("fechaFinalizacion"),
                    document.getElementById("idTarea"),
                    document.getElementById("tituloTarea"),
                    document.getElementById("descripcionTarea"),
                    document.getElementById("selectPrioridad"),
                    document.getElementById("horaCreacion")
                    );

            snapFechaFin = parseDate(btnVisibility.value);
            snapVisibility = parseVisibility(btnVisibility.value);
            snapTitulo = inputTituloTarea.value;
            snapDescripcion = inputDescripcionTarea.value;
            snapPrioridad = selectPrioridad.value;

            btnCreate.onclick = () => editTask();

        } else {

            fechaHoy.value = parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
            fechaFinalizacion.value = fechaFinalizacion.min;
            labelIdTarea.innerHTML = generatePushID();
            btnCreate.onclick = () => createTask(document.getElementById("visibility"),
                        document.getElementById("fechaHoy"),
                        document.getElementById("fechaFinalizacion"),
                        document.getElementById("idTarea"),
                        document.getElementById("tituloTarea"),
                        document.getElementById("descripcionTarea"),
                        document.getElementById("selectPrioridad")
                        );

        }

    } else {


        generateToast("Autenticación", "Usuario deslogueado !", (today.getHours() + ":" + today.getMinutes()), 3000);
        setTimeout(function () {
            location.href = "..\\Index.html"
        }, 3000);
    }
});

function editTask() {

    var modificado = false;
    var valueVisibility = parseVisibility(btnVisibility.value);

    if (parseDate(fechaFinalizacion.value) != parseDate(snapFechaFin)) {
        modificado = true;
    }

    if (valueVisibility != snapVisibility) {
        modificado = true;
    }
    if (selectPrioridad.value != snapPrioridad) {
        modificado = true;
    }
    if (inputTituloTarea.value != snapTitulo) {
        modificado = true;
    }


    if (inputDescripcionTarea.value != snapDescripcion) {
        modificado = true;
    }
    if (modificado) {

        const postData = {
            AdjuntosTarea: "/",
            DescripcionTarea: preventCodeInjection(inputDescripcionTarea.value),
            EstadoTarea: true,
            FechaCreacionTarea: parseDate(fechaHoy.value),
            HoraCreacion:horaCreacion.value,
            FechaVencimientoTarea: parseDate(fechaFinalizacion.value),
            IDPadre: "",
            IDTarea: labelIdTarea.innerHTML,
            IDUsuario: auth.currentUser.uid,
            NombreTarea: preventCodeInjection(inputTituloTarea.value),
            PrioridadTarea: selectPrioridad.value,
            VisibilidadTarea: valueVisibility
        };

        changeData("Tareas", labelIdTarea.innerHTML, postData);

        setTimeout(function () {
            location.href = "./MainPage.html";
        }, 1000);


        setTimeout(function () {
            location.href = "/MainPage.html"
        }, 3000);

    }
}

function createTask(btnVisibility, fechaHoy, fechaFinalizacion, labelIdTarea, inputTituloTarea, inputDescripcionTarea, selectPrioridad) {

    fechaHoy.min = parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
    fechaFinalizacion.min = parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + (today.getDate() + 1));

    var validado = false;
    var valueVisibility = false;


    if (btnVisibility.value == 0) {
        valueVisibility = false;
    } else {
        valueVisibility = true;
    }

    console.log(selectPrioridad.value != "");
    if (inputTituloTarea.value != "" && inputDescripcionTarea.value != "" && selectPrioridad.value != "" && parseDate(fechaHoy.value) != parseDate(fechaFinalizacion.value)) {
        validado = true;
    }

    if (validado) {



        const postData = {
            AdjuntosTarea: "/",
            DescripcionTarea: preventCodeInjection(inputDescripcionTarea.value),
            EstadoTarea: true,
            FechaCreacionTarea: parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate()),            
            HoraCreacion: parseHour(today.getHours() + ":" + today.getMinutes()),
            FechaVencimientoTarea: parseDate(fechaFinalizacion.value),
            IDPadre: "",
            IDTarea: labelIdTarea.innerHTML,
            IDUsuario: auth.currentUser.uid,
            NombreTarea: preventCodeInjection(inputTituloTarea.value),
            PrioridadTarea: selectPrioridad.value,
            VisibilidadTarea: valueVisibility
        };

        changeData("Tareas", labelIdTarea.innerHTML, postData);

        setTimeout(function () {
            location.href = "./MainPage.html";
        }, 1000);

        /**
         * Mostraremos el toast antes de cambiar de página.
         */
        setTimeout(function () {
            location.href = "/MainPage.html"
        }, 3000);


    } else {

        if (inputTituloTarea.value == "") {
            inputTituloTarea.style.setProperty('border', '1px solid red', 'important');
        } else {
            inputTituloTarea.style.setProperty('border', '1px solid black', 'important');
        }
        if (inputDescripcionTarea.value == "") {
            inputDescripcionTarea.style.setProperty('border', '1px solid red', 'important');
        } else {
            inputDescripcionTarea.style.setProperty('border', '1px solid black', 'important');
        }
        if (selectPrioridad.value == "") {
            selectPrioridad.style.border = "1px solid red";
        } else {
            selectPrioridad.style.border = "1px solid black";
        }

        if (parseDate(fechaHoy.value) == parseDate(fechaFinalizacion.value)) {
            fechaFinalizacion.style.border = "1px solid red";
        } else {
            fechaFinalizacion.style.border = "1px solid black";
        }

        generateToast("Error de verificación", "Rellena los campos !", (today.getHours() + ":" + today.getMinutes()), 2000);

    }



}


function parseVisibility(btnVisibility) {
    if (btnVisibility == 0) {
        return false;
    } else {
        return true;
    }
}

btnSignOut.onclick = () => {
    UserSignOut()
};

fotoPerfil.onerror = () => {
    fotoPerfil.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
    console.log("ha fallado")
};

divBtnVisibility.onclick = () => {

    if (btnVisibility.value == 0) {
        btnVisibility.value = 1;
        document.getElementById("labelVisibility").className = "fa-solid fa-lock-open";
    } else {
        btnVisibility.value = 0;
        document.getElementById("labelVisibility").className = "fa-solid fa-lock";
    }

};
    