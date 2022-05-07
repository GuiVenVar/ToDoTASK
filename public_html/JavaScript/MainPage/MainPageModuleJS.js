/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { DataSnapshot, getDatabase, ref, get, set, child, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
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

const loader = document.getElementById("loader");
const fotoPerfil = document.getElementById("fotoPerfil");

getAuth().onAuthStateChanged(function (user) {
    if (user) {

        const userRef = ref(db, 'Usuarios/' + getAuth().currentUser.uid);
        onValue(userRef, (snapshot) => {

            loadProfilePicture();
        });

        function loadData(element, estadoTarea) {

            loader.style.display = "block";

            element.innerHTML = "";

            var divTareasGeneral = document.createElement("div");

            var divTareasPrioridadAlta = document.createElement("div");
            divTareasPrioridadAlta.id = "prioridadAlta";

            var divTareasPrioridadMedia = document.createElement("div");
            divTareasPrioridadMedia.id = "prioridadMedia";

            var divTareasPrioridadBaja = document.createElement("div");
            divTareasPrioridadBaja.id = "prioridadBaja";



            var cajaTareas = document.createElement("a");

            const starCountRef = ref(db, 'Tareas/')
            onValue(starCountRef, (snapshot) => {

                divTareasGeneral.className = "d-flex flex-column align-items-stretch flex-shrink-0 bg-white";
                divTareasGeneral.id = "taskList";

                cajaTareas.innerHTML = "";
                cajaTareas.href = "#";
                cajaTareas.className = "d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none";

                var spanCabeceraTarea = document.createElement("span");
                spanCabeceraTarea.className = "fs-5 fw-bold";
                spanCabeceraTarea.style.marginLeft = "1%";
                spanCabeceraTarea.id = "taskListCabecera";

                var textoCabecera = document.createElement("i");

                switch (estadoTarea) {
                    case true:

                        textoCabecera.className = "fa-solid fa-2xl fa-magnifying-glass";
                        textoCabecera.style.color = "#81A594";
                        spanCabeceraTarea.appendChild(textoCabecera);
                        spanCabeceraTarea.innerHTML += "Completadas";

                        break;
                    case false:

                        textoCabecera.className = "fa-solid fa-2xl fa-magnifying-glass";
                        textoCabecera.style.color = "#81A594";
                        spanCabeceraTarea.appendChild(textoCabecera);
                        spanCabeceraTarea.innerHTML += "Pendientes";

                        break;
                    default:

                        textoCabecera.className = "fa-solid fa-2xl fa-magnifying-glass";
                        textoCabecera.style.color = "#81A594";
                        spanCabeceraTarea.appendChild(textoCabecera);
                        spanCabeceraTarea.innerHTML += "Públicas";

                        break;
                }

                /**
                 * Aqui unimos  el div general al "a" de la cabecera
                 */

                cajaTareas.appendChild(spanCabeceraTarea);


                /**
                 * Hasta aqui hemos generado la cabecera donde aparece el nombre del tipo de busqueda 
                 * - Pendientes
                 * - Completadas
                 * - Públicas
                 */

                snapshot.forEach(function (childSnap) {

                    var bloqueTarea = document.createElement("a");
                    bloqueTarea.href = "#";
                    bloqueTarea.className = "list-group-item list-group-item-action py-3 lh-tight";
                    bloqueTarea.id = "bloqueTareas";
                    bloqueTarea.ariaCurrent = "true";
                    bloqueTarea.style.zIndex = "1";

                    if (childSnap.val().EstadoTarea == estadoTarea || childSnap.val().IDUsuario == auth.uid || estadoTarea == "Publicas") {


                        var divTareaButtons = document.createElement("div");
                        divTareaButtons.className = "multi-button";
                        divTareaButtons.id = "multiButton";

                        var btnFinish = document.createElement("button");
                        btnFinish.className = "fa-solid fa-flag-checkered";

                        var btnComment = document.createElement("button");
                        btnComment.className = "fas fa-comment";

                        var btnShare = document.createElement("button");
                        btnShare.className = "fas fa-share-alt";

                        var btnTrash = document.createElement("button");
                        btnTrash.className = "fas fa-trash";
                        btnTrash.onclick = () => {
                            deleteTask(childSnap.val().IDTarea);
                        }

                        divTareaButtons.appendChild(btnFinish);
                        divTareaButtons.appendChild(btnComment);
                        divTareaButtons.appendChild(btnShare);
                        divTareaButtons.appendChild(btnTrash);

                        var divDetallesTareas = document.createElement("div");
                        divDetallesTareas.className = "d-flex w-100 align-items-center justify-content-between";


                        var cabeceraDetalleTarea = document.createElement("strong");
                        cabeceraDetalleTarea.className = "mb-1";
                        cabeceraDetalleTarea.innerHTML += childSnap.val().NombreTarea;

                        var fechaTarea = document.createElement('small');
                        fechaTarea.innerHTML += childSnap.val().FechaCreacionTarea;

                        divDetallesTareas.appendChild(cabeceraDetalleTarea);
                        divDetallesTareas.appendChild(fechaTarea);

                        var divDescripcionTarea = document.createElement("div");
                        divDescripcionTarea.className = "col-10 mb-1 small";
                        divDescripcionTarea.innerHTML += childSnap.val().DescripcionTarea;

                        // Hidden input para pasar el ID de la tarea.

//                        var idTarea = document.createElement("input");
//                        idTarea.id = "IDTarea";                     
//                        idTarea.name = "IDTarea";
//                        idTarea.type = "hidden";
//                        idTarea.value = childSnap.val().IDTarea;
//                        bloqueTarea.appendChild(idTarea);

                        bloqueTarea.appendChild(divTareaButtons);
                        bloqueTarea.appendChild(divDetallesTareas);
                        bloqueTarea.appendChild(divDescripcionTarea);


                        bloqueTarea.onmouseover = () => {

                            bloqueTarea.style.backgroundColor = "aliceblue";
                            bloqueTarea.firstChild.style.display = "block";
                        }

                        bloqueTarea.onmouseout = () => {

                            bloqueTarea.style.backgroundColor = "white";
                            bloqueTarea.firstChild.style.display = "none";
                        }

                        var divider = document.createElement("div");
                        divider.className = "divider d-flex";
                        divider.style.height = "5px";

                        switch (childSnap.val().PrioridadTarea) {
                            case "Alta":
                                bloqueTarea.style.borderLeft = "5px solid red";
                                divTareasPrioridadAlta.appendChild(bloqueTarea);
                                divTareasPrioridadAlta.appendChild(divider);
                                break;
                            case "Media":
                                bloqueTarea.style.borderLeft = "5px solid yellow";
                                divTareasPrioridadMedia.appendChild(bloqueTarea);
                                divTareasPrioridadMedia.appendChild(divider);
                                break;
                            case "Baja":
                                bloqueTarea.style.borderLeft = "5px solid green";
                                divTareasPrioridadBaja.appendChild(bloqueTarea);
                                divTareasPrioridadBaja.appendChild(divider);
                                break;
                        }
                    }
                });
            });


            divTareasGeneral.appendChild(divTareasPrioridadAlta);
            divTareasGeneral.appendChild(divTareasPrioridadMedia);
            divTareasGeneral.appendChild(divTareasPrioridadBaja);
            element.appendChild(cajaTareas);
            element.appendChild(divTareasGeneral);

            loader.style.display = "none";
        }

        /**
         * Search Element.
         */

        var elementSearchText = document.getElementById("searchText");
        elementSearchText.oninput = function busquedaPersonalizada() {

            loader.style.visibility = "Visible";

            var element, i, tabcontent;
            tabcontent = document.getElementsByClassName("tabcontent");
            element = document.getElementById("Publicas");
            var divTareasGeneral = document.createElement("div");

            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
                tabcontent[i].innerHTML = "";
            }


            const starCountRef = ref(db, 'Tareas/')
            onValue(starCountRef, (snapshot) => {

                divTareasGeneral.className = "d-flex flex-column align-items-stretch flex-shrink-0 bg-white";
                divTareasGeneral.id = "taskList";

                var cajaTareas = document.createElement("a");
                cajaTareas.href = "#";
                cajaTareas.className = "d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none";

                var spanCabeceraTarea = document.createElement("span");
                spanCabeceraTarea.className = "fs-5 fw-bold";
                spanCabeceraTarea.style.marginLeft = "1%";
                spanCabeceraTarea.id = "taskListCabecera";

                var textoCabecera = document.createElement("i");
                textoCabecera.className = "fa-solid fa-2xl fa-magnifying-glass";
                textoCabecera.style.color = "#81A594";
                spanCabeceraTarea.appendChild(textoCabecera);
                spanCabeceraTarea.innerHTML += "Busqueda personalizada";

                /**
                 * Hasta aqui hemos generado la cabecera donde aparece el nombre del tipo de busqueda 
                 * - Pendientes
                 * - Completadas
                 * - Públicas
                 */

                cajaTareas.appendChild(spanCabeceraTarea);
                divTareasGeneral.appendChild(cajaTareas);

                snapshot.forEach(function (childSnap) {

                    var bloqueTareas = document.createElement("a");
                    bloqueTareas.href = "#";
                    bloqueTareas.className = "list-group-item list-group-item-action py-3 lh-tight";
                    bloqueTareas.id = "bloqueTareas";
                    bloqueTareas.ariaCurrent = "true";
                    bloqueTareas.style.zIndex = "1";

                    switch (childSnap.val().PrioridadTarea) {
                        case "Alta":
                            bloqueTareas.style.borderLeft = "5px solid red";
                            break;
                        case "Media":
                            bloqueTareas.style.borderLeft = "5px solid yellow";
                            break;
                        case "Baja":
                            bloqueTareas.style.borderLeft = "5px solid green";
                            break;
                    }

                    if (childSnap.val().NombreTarea.toLowerCase().includes(elementSearchText.value.toLowerCase())) {

                        var divTareaButtons = document.createElement("div");
                        divTareaButtons.className = "multi-button";
                        divTareaButtons.id = "multiButton";

                        var btnFinish = document.createElement("button");
                        btnFinish.className = "fa-solid fa-flag-checkered";

                        var btnComment = document.createElement("button");
                        btnComment.className = "fas fa-comment";

                        var btnShare = document.createElement("button");
                        btnShare.className = "fas fa-share-alt";

                        var btnTrash = document.createElement("button");
                        btnTrash.className = "fas fa-trash";

                        divTareaButtons.appendChild(btnFinish);
                        divTareaButtons.appendChild(btnComment);
                        divTareaButtons.appendChild(btnShare);
                        divTareaButtons.appendChild(btnTrash);

                        var divDetallesTareas = document.createElement("div");
                        divDetallesTareas.className = "d-flex w-100 align-items-center justify-content-between";


                        var cabeceraDetalleTarea = document.createElement("strong");
                        cabeceraDetalleTarea.className = "mb-1";
                        cabeceraDetalleTarea.innerHTML += childSnap.val().NombreTarea;

                        var fechaTarea = document.createElement('small');
                        fechaTarea.innerHTML += childSnap.val().FechaCreacionTarea;

                        divDetallesTareas.appendChild(cabeceraDetalleTarea);
                        divDetallesTareas.appendChild(fechaTarea);

                        var divDescripcionTarea = document.createElement("div");
                        divDescripcionTarea.className = "col-10 mb-1 small";
                        divDescripcionTarea.innerHTML += childSnap.val().DescripcionTarea;

                        bloqueTareas.appendChild(divTareaButtons);
                        bloqueTareas.appendChild(divDetallesTareas);
                        bloqueTareas.appendChild(divDescripcionTarea);


                        bloqueTareas.onmouseover = () => {

                            bloqueTareas.style.backgroundColor = "aliceblue";
                            bloqueTareas.firstChild.style.display = "block";
                        }

                        bloqueTareas.onmouseout = () => {

                            bloqueTareas.style.backgroundColor = "white";
                            bloqueTareas.firstChild.style.display = "none";
                        }

                        var divider = document.createElement("div");
                        divider.className = "divider d-flex";
                        divider.style.height = "5px";

                        divTareasGeneral.appendChild(divider);
                        divTareasGeneral.appendChild(bloqueTareas);

                    }
                });

            });

            element.appendChild(divTareasGeneral);

            element.style.display = "block";
            loader.style.visibility = "hidden";

        };

        function openTasks(evt, taskType) {

            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tabcontent");

            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
                tabcontent[i].innerHTML = "";
            }
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }

            evt.style.display = "block";
            evt.className += " active";

            switch (taskType) {
                case "tabLinkCompletadas":
                    loadData(document.getElementById("Completadas"), true);
                    document.getElementById("Completadas").style.display = "block";
                    break;
                case "tabLinkPendientes":
                    loadData(document.getElementById("Pendientes"), false);
                    document.getElementById("Pendientes").style.display = "block";
                    break;
                default:
                    loadData(document.getElementById("Publicas"), "Publicas");
                    document.getElementById("Publicas").style.display = "block";
                    break;

            }
        }

        function deleteTask(IDTarea) {
            if (confirm("Seguro quieres borrar => " + IDTarea + "?")) {


                remove(ref(db, "Tareas/" + IDTarea))
                        .then(() => {
                            location.reload();
                        })
                        .catch((error) => {
                            alert("Ha fallado por : " + error.message);
                        });

            }
        }



        function completeTask() { }
        function setToPublic() { }
        function setToPrivate() { }
        function setHighPriority() { }
        function setMidPriority() { }
        function setLowPriority() { }
        function createTask() { }




        function UserSignOut() {

            const auth = getAuth();
            signOut(auth).then(() => {
                window.location.href = "..\\Index.html";
            }).catch((error) => {
                console.log("Error desconectando !");
            });

        }

        var btnSignOut = document.getElementById("signOut");
        btnSignOut.onclick = () => {
            UserSignOut()
        };

        var eTablinkPendiente = document.getElementById("tabLinkPendientes");
        eTablinkPendiente.onclick = () => {
            openTasks(eTablinkPendiente, 'tabLinkPendientes');
        };

        var eTablinkCompletadas = document.getElementById("tabLinkCompletadas");
        eTablinkCompletadas.onclick = () => {
            openTasks(eTablinkCompletadas, 'tabLinkCompletadas');
        };

        var eTablinkPublicas = document.getElementById("tabLinkPublicas");
        eTablinkPublicas.onclick = () => {
            openTasks(eTablinkPublicas, 'tabLinkPublicas');
        };

        openTasks(document.getElementById("Publicas"), "Publicas");

        // User is signed in.
    } else {

        alert("Usuario deslogueado !");
        window.location.href = "..\\Index.html";
    }
});

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

