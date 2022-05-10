/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { DataSnapshot, getDatabase, ref as databaseRef, get, set, child, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCw4VX9XmPQuTPclMsoQn3No05MhqckG0A",
    databaseURL: "https://tododaw-default-rtdb.europe-west1.firebasedatabase.app",
    authDomain: "tododaw.firebaseapp.com",
    projectId: "tododaw",
    storageBucket: "tododaw.appspot.com",
    messagingSenderId: "669151393033",
    appId: "1:669151393033:web:08c29e64571ab03b8f0fd8",
    measurementId: "G-XV3GDKTE6J"
};

// Initialize Firebase
// Inicialización de Firebase
const firebase = initializeApp(firebaseConfig);
// Estadisticas y analiticas de Firebase
const analytics = getAnalytics(firebase);
// BBDD - General
const db = getDatabase();
// Auth - Usuario
const auth = getAuth();
// Firebase Storage
const storage = getStorage();

const fotoPerfil = document.getElementById("fotoPerfilNav");
const btnSignOut = document.getElementById("signOut");

const btnVisibility = document.getElementById("visibility");
const fechaHoy = document.getElementById("fechaHoy");
const fechaFinalizacion = document.getElementById("fechaFinalizacion");
const labelIdTarea = document.getElementById("idTarea");
const inputTituloTarea = document.getElementById("tituloTarea");
const inputDescripcionTarea = document.getElementById("descripcionTarea");
const btnCreate = document.getElementById("btnCreate");
const selectPrioridad = document.getElementById("selectPrioridad");
var today = new Date();


/**
 * 
 * Le añadimos un dia mas a la fecha de finalizacion y al dia de hoy que no se pueda modificar
 */
fechaHoy.min = parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
fechaFinalizacion.min = parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + (today.getDate()+1));

var getURL = window.location.href;

getAuth().onAuthStateChanged(function (user) {
    if (user) {
        const userRef = databaseRef(db, 'Usuarios/' + getAuth().currentUser.uid);
        onValue(userRef, (snapshot) => {
            loadProfilePicture();

            if (getURL.includes("?")) {

                cargarTarea(getURL.split("?")[1]);

            } else {

                fechaHoy.value = parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
                fechaFinalizacion.value = parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
                labelIdTarea.innerHTML = generatePushID();
                btnCreate.onclick = () => crearTarea();

            }

        },(error) =>{console.log(error.message)});
    } else {

        alert("Usuario deslogueado !");
        window.location.href = "..\\Index.html";
    }
});

function UserSignOut() {

    const auth = getAuth();
    signOut(auth).then(() => {
        window.location.href = "..\\Index.html";
    }).catch((error) => {
        console.log("Error desconectando !");
    });

}

function loadProfilePicture() {

    getDownloadURL(storageRef(storage, 'gs://tododaw.appspot.com/photoUser/' + auth.currentUser.uid + ".jpg"))
            .then((url) => {

                fotoPerfil.src = url;
                console.log("Cargadas");

            })
            .catch((error) => {
                console.log("Error cargando datos loadProfilePicture => " + error.message);
            }).finally(() => {

    });

}


function crearTarea() {

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

        set(databaseRef(db, "Tareas/" + labelIdTarea.innerHTML), {
            AdjuntosTarea: "/",
            DescripcionTarea: inputDescripcionTarea.value,
            EstadoTarea: true,
            FechaCreacionTarea: parseDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate()),
            FechaVencimientoTarea: parseDate(fechaFinalizacion.value),
            IDPadre: "",
            IDTarea: labelIdTarea.innerHTML,
            IDUsuario: auth.currentUser.uid,
            NombreTarea: inputTituloTarea.value,
            PrioridadTarea: selectPrioridad.value,
            VisibilidadTarea: valueVisibility
        }).then(() => {
            alert("Se ha creado correctamente");
            window.location.href = "\MainPage.html";
        }).catch((error) => {
            alert(error.message);
        });
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

        alert("Rellena los campos !");

    }



}

function modificarTarea(data) {

    var modificado = false;
    var valueVisibility = false;

    if (parseDate(fechaFinalizacion.value) != parseDate(data.FechaVencimientoTarea)) {
        modificado = true;
    }
    if (btnVisibility.value == 0) {
        valueVisibility = false;
    } else {
        valueVisibility = true;
    }

    if (valueVisibility != data.VisibilidadTarea) {
        modificado = true;
    }
    if (selectPrioridad.value != data.PrioridadTarea) {
        modificado = true;
    }
    if (inputTituloTarea.value != data.NombreTarea) {
        modificado = true;
    }
    if (inputDescripcionTarea.value != data.DescripcionTarea) {
        modificado = true;
    }
    if (modificado) {

        set(databaseRef(db, "Tareas/" + data.IDTarea), {
            AdjuntosTarea: "/",
            DescripcionTarea: inputDescripcionTarea.value,
            EstadoTarea: false,
            FechaCreacionTarea: parseDate(data.FechaCreacionTarea),
            FechaVencimientoTarea: parseDate(fechaFinalizacion.value),
            IDPadre: "",
            IDTarea: data.IDTarea,
            IDUsuario: data.IDUsuario,
            NombreTarea: inputTituloTarea.value,
            PrioridadTarea: selectPrioridad.value,
            VisibilidadTarea: valueVisibility
        }).then(() => {
            alert("Se ha modificado correctamente");
            window.location.href = "\MainPage.html";
        }).catch((error) => {
            alert(error.message);
        });
    } else {
        alert("No ha cambiado nada por aqui... No se modifica.");
    }

}

/**
 * Aqui verificamos si contiene el token de la ID para modificar una tarea.
 */
function cargarTarea(idTarea) {

    const dbRef = databaseRef(db, 'Tareas/' + idTarea);
    onValue(dbRef, (snapshot) => {
        if (snapshot.val() != null) {

            const data = snapshot.val();

            btnCreate.onclick = () => modificarTarea(data);

            if (data.VisibilidadTarea) {
                btnVisibility.value = 1;
            } else {
                btnVisibility.value = 0;
            }

            fechaHoy.value = parseDate(data.FechaCreacionTarea);
            fechaFinalizacion.value = parseDate(data.FechaVencimientoTarea);
            labelIdTarea.innerHTML = data.IDTarea;
            inputTituloTarea.value = data.NombreTarea;
            inputDescripcionTarea.value = data.DescripcionTarea;
            selectPrioridad.value = data.PrioridadTarea;

        } else {
            alert("La tarea no existe.");
            window.location.href = "\MainPage.html";
        }
    });
}

function parseDate(stringData) {

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
console.log("parseData => " + myDateString)
    return myDateString;
}

function generatePushID() {
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

btnSignOut.onclick = () => {
    UserSignOut()
};



