/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




import { ref, onValue, query, limitToFirst, limitToLast, get, off} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { firebase, analytics, auth, db, storage, UserSignOut, deleteTask, shareTask, loadProfilePicture, changeData } from "../Connection/BBDDFunctions.js";
import { parseDate, generateToast, generateLoader, preventCodeInjection } from "../JSFunctions.js";
import {Tareas} from "../Models/Tareas.js";
var today = new Date();

const fotoPerfil = document.getElementById("fotoPerfil");

/**
 * 
 * @type NodeList Obtenemos todas las tareas para el observador
 */
var bloqueTareasSelection = document.getElementsByName("bloqueTareas");



/**
 * 
 * @type FirebaseReference , Obtenemos la referencia a Firebase de Tareas
 */

const dbTareas = ref(db, 'Tareas/');

var myFirebaseChildSnap = new Array();
var myFirebaseTasks = new Array();
var indexActual = 0;
var indexMaximo = 0;

/**
 * 
 * @param {Array} array de tareas principal
 * @param {Array} array de tareas extraido de Firebase
 * @returns {Boolean} True si son identicos.
 */

const equals = (arr, arr1) => JSON.stringify(arr) === JSON.stringify(arr1);

/**
 * Observer
 */
var observer;
const setObserver = () => {

    /**
     * 
     * @param {nodeValueChanged} entries
     * @returns {Nothing} Tenemos la entrada del observer que nos dirá si se ha visto o no un elemento
     */
    const callback = (entries) => {
        entries.forEach(entry => {
            /**
             * Comprobamos si está el usuario viendo el elemento
             */
            if (entry.isIntersecting) {
                if (indexMaximo > indexActual) {

                    loadNewTask(myFirebaseChildSnap[indexActual]);
                    console.log("Loaded New Observed Task Index = " + indexActual);
                    bloqueTareasSelection = document.getElementsByName("bloqueTareas");
                    observer.disconnect(); // Quitamos el ultimo observador
                    setObserver(); // Y Ponemos el nuevo.
                    indexActual++;

                } else {
                    console.log("End of Array !")
                }
            }
        });
    }

    const options = {

        /**
         * Threshold , Tiene valores entre 0 y 1 , se utiliza para ver el % de elemento que hemos visto
         */
        threshold: 1
    };

    observer = new IntersectionObserver(callback, options);

    observer.observe(bloqueTareasSelection[bloqueTareasSelection.length - 1]);


}
/**
 * Fin Observer
 */


auth.onAuthStateChanged(function (user) {


    if (user) {

        loadProfilePicture(document.getElementById("fotoPerfil"));


        get(query(dbTareas, limitToFirst(999)));

        onValue(dbTareas, (snapshot) => {
            console.log("******** onValue");
            myFirebaseChildSnap = new Array();
            myFirebaseTasks = new Array();

            snapshot.forEach(function (childSnap) {
                if (childSnap.val().IDUsuario == user.uid || childSnap.val().VisibilidadTarea == true) {
                    var t = new Tareas(
                            childSnap,
                            childSnap.val().IDTarea,
                            childSnap.val().IDUsuario,
                            childSnap.val().IDPadre,
                            childSnap.val().NombreTarea,
                            childSnap.val().DescripcionTarea,
                            childSnap.val().FechaCreacionTarea,
                            childSnap.val().HoraCreacion,
                            childSnap.val().FechaVencimientoTarea,
                            childSnap.val().PrioridadTarea,
                            childSnap.val().EstadoTarea,
                            childSnap.val().VisibilidadTarea,
                            childSnap.val().AdjuntosTarea
                            );
                    myFirebaseChildSnap.push(t);

                }

            });

            /**
             * 
             * Singleton
             */


            indexMaximo = myFirebaseChildSnap.length;

            if (myFirebaseChildSnap.length == 0) {
                console.log("******** snapshot Length 0");

                indexActual = myFirebaseChildSnap.length;
                myFirebaseTasks = myFirebaseChildSnap;
                document.getElementById("tabLinkPendientes").click();
            }

            if (!equals(myFirebaseChildSnap, myFirebaseTasks)) {

                console.log("******** snapshot Length != 0");

                for (var i = 0; i < indexMaximo; i++) {

                    myFirebaseTasks.push(myFirebaseChildSnap[i]);

                }
                myFirebaseTasks = myFirebaseTasks.reverse();

                document.getElementById("tabLinkPendientes").click();

            }
            /**
             * 
             * Fin Singleton
             */
            document.getElementById("loader").style.display = "none";

        });


        window.onload = openTasks(document.getElementById("Pendientes"), "Pendientes");

    } else {
        generateToast("Información Firebase Auth", "Usuario Deslogueado !", (today.getHours() + ":" + today.getMinutes()), 2000);

        setTimeout(function () {
            location.href = "..\\Index.html";
        }, 2000);
    }
});

function openTasks(evt, taskType) {

    console.log("******** OpenTasks By  " + evt.id);

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

function loadNewTask(myTask) {
    console.log("******** Load new Task by Observer ");
    var divTareasPrioridadAlta = document.getElementById("prioridadAlta");
    var divTareasPrioridadMedia = document.getElementById("prioridadMedia");
    var divTareasPrioridadBaja = document.getElementById("prioridadBaja");
    var spanCabeceraTarea = document.getElementById("taskListCabecera");

    document.getElementById("loader").style.display = "block";
    var bloqueTarea = document.createElement("a");
    bloqueTarea.href = "#";
    bloqueTarea.className = "list-group-item list-group-item-action py-3 lh-tight";
    bloqueTarea.id = "bloqueTareas";
    bloqueTarea.name = "bloqueTareas";
    bloqueTarea.ariaCurrent = "true";
    bloqueTarea.style.zIndex = "1";



    if ((myTask.getVisibilidad == true && spanCabeceraTarea.innerText == "Públicas") ||
            (myTask.getVisibilidad == true && spanCabeceraTarea.innerText == "Búsqueda Personalizada") ||
            spanCabeceraTarea.innerText == "Búsqueda Personalizada" ||
            (myTask.getIdUsuario == auth.currentUser.uid && myTask.getEstado == true && spanCabeceraTarea.innerText == "Pendientes") ||
            (myTask.getIdUsuario == auth.currentUser.uid && myTask.getEstado == false && spanCabeceraTarea.innerText == "Completadas")
            ) {

        bloqueTarea.onclick = () => {
            document.getElementById("loader").style.display = "block";
            if (myTask.getEstado && myTask.getIdUsuario == auth.currentUser.uid) {
                window.location.href = "\NewTask.html?" + myTask.getId;
            } else {
                generateToast("Error de verificación", "Esta tarea no se puede modificar por este usuario.", (today.getHours() + ":" + today.getMinutes()), 2000);
            }
            document.getElementById("loader").style.display = "none";
        }

        var divTareaButtons = document.createElement("div");
        divTareaButtons.className = "multi-button";
        divTareaButtons.id = "multiButton";

        var btnFinish = document.createElement("button");
        btnFinish.className = "fa-solid fa-flag-checkered";
        btnFinish.onclick = () => {
            document.getElementById("loader").style.display = "block";
            finishTask(myTask);
            document.getElementById("tabLinkCompletadas").click();
            document.getElementById("loader").style.display = "none";
        }

        var btnEdit = document.createElement("button");
        btnEdit.className = "fas fa-edit";
        btnEdit.onclick = () => {
            document.getElementById("loader").style.display = "block";
            if (myTask.getEstado && myTask.getIdUsuario == auth.currentUser.uid) {
                window.location.href = "\NewTask.html?" + myTask.getId;
            } else {
                generateToast("Error de verificación", "Esta tarea no se puede modificar por este usuario.", (today.getHours() + ":" + today.getMinutes()), 2000);
            }
            document.getElementById("loader").style.display = "none";
        }

        var btnShare = document.createElement("button");
        btnShare.className = "fas fa-share-alt";
        btnShare.onclick = () => {
            document.getElementById("loader").style.display = "block";
            shareTask(myTask);
            document.getElementById("tabLinkPublicas").click();
            document.getElementById("loader").style.display = "none";
        };

        var btnTrash = document.createElement("button");
        btnTrash.className = "fas fa-trash";
        btnTrash.onclick = () => {
            document.getElementById("loader").style.display = "block";
            deleteTask(myTask.getNombre, myTask.getId, myTask.getIdUsuario);
            document.getElementById("tabLinkPendientes").click();
            document.getElementById("loader").style.display = "none";
        }


        divTareaButtons.appendChild(btnFinish);
        divTareaButtons.appendChild(btnEdit);
        divTareaButtons.appendChild(btnShare);
        divTareaButtons.appendChild(btnTrash);
        var divDetallesTareas = document.createElement("div");
        divDetallesTareas.className = "d-flex w-100 align-items-center justify-content-between";
        var cabeceraDetalleTarea = document.createElement("strong");
        cabeceraDetalleTarea.className = "mb-1";
        cabeceraDetalleTarea.innerHTML += myTask.getNombre;
        var fechaTarea = document.createElement('small');
        fechaTarea.innerHTML += myTask.getHoraCreacion + " | " + myTask.getFechaFin;
        divDetallesTareas.appendChild(cabeceraDetalleTarea);
        divDetallesTareas.appendChild(fechaTarea);
        var divDescripcionTarea = document.createElement("div");
        divDescripcionTarea.className = "col-10 mb-1 small";
        divDescripcionTarea.innerHTML += myTask.getDescripcion;
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

        var dateToday = parseDate(today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
        var dateTask = parseDate(myTask.getFechaFin);

        var divider = document.createElement("div");
        divider.className = "divider d-flex";
        divider.style.height = "5px";


        switch (myTask.getPrioridad) {
            case "Alta":
                if (dateToday == dateTask) {
                    fechaTarea.innerHTML += "<lord-icon src='https://cdn.lordicon.com/mbyiiqnh.json'trigger='loop' title='Termina hoy!' colors='primary:#121331,secondary:#08a88a' style='width:35px;height:35px' ></lord-icon>"
                }
                bloqueTarea.style.borderLeft = "5px solid red";
                divTareasPrioridadAlta.appendChild(bloqueTarea);
                divTareasPrioridadAlta.appendChild(divider);
                break;
            case "Media":
                if (dateToday == dateTask) {
                    fechaTarea.innerHTML += "<lord-icon src='https://cdn.lordicon.com/mbyiiqnh.json'trigger='loop' title='Termina hoy!' colors='primary:#121331,secondary:#08a88a' style='width:35px;height:35px' ></lord-icon>"
                    bloqueTarea.style.borderLeft = "5px solid yellow";
                    divTareasPrioridadAlta.appendChild(bloqueTarea);
                    divTareasPrioridadAlta.appendChild(divider);
                } else {
                    bloqueTarea.style.borderLeft = "5px solid yellow";
                    divTareasPrioridadMedia.appendChild(bloqueTarea);
                    divTareasPrioridadMedia.appendChild(divider);
                }
                break;
            case "Baja":
                if (dateToday == dateTask) {
                    fechaTarea.innerHTML += "<lord-icon src='https://cdn.lordicon.com/mbyiiqnh.json'trigger='loop' colors='primary:#121331,secondary:#08a88a' style='width:40px;height:40px'></lord-icon>"
                    bloqueTarea.style.borderLeft = "5px solid green";
                    divTareasPrioridadAlta.appendChild(bloqueTarea);
                    divTareasPrioridadAlta.appendChild(divider);

                } else {
                    bloqueTarea.style.borderLeft = "5px solid green";
                    divTareasPrioridadBaja.appendChild(bloqueTarea);
                    divTareasPrioridadBaja.appendChild(divider);
                }
                break;
        }
    }
    document.getElementById("loader").style.display = "none";
}

function loadData(element, estadoTarea) {


    console.log("******** Load Data by :  " + element.id + " FirebaseTaskArray Value = " + myFirebaseTasks.length);


    element.innerHTML = "";
    var divTareasGeneral = document.createElement("div");

    var divTareasPrioridadAlta = document.createElement("div");

    divTareasPrioridadAlta.id = "prioridadAlta";
    var divTareasPrioridadMedia = document.createElement("div");

    divTareasPrioridadMedia.id = "prioridadMedia";
    var divTareasPrioridadBaja = document.createElement("div");

    divTareasPrioridadBaja.id = "prioridadBaja";

    var loader = generateLoader();

    element.appendChild(loader);

    var cajaTareas = document.createElement("a");


    divTareasPrioridadAlta.innerHTML = "";
    divTareasPrioridadMedia.innerHTML = "";
    divTareasPrioridadBaja.innerHTML = "";

    divTareasGeneral.className = "d-flex flex-column align-items-stretch flex-shrink-0 bg-white";
    divTareasGeneral.id = "taskList";
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

    myFirebaseTasks.forEach(myTask => {

        document.getElementById("loader").style.display = "block";
        var bloqueTarea = document.createElement("a");
        bloqueTarea.href = "#";
        bloqueTarea.className = "list-group-item list-group-item-action py-3 lh-tight";
        bloqueTarea.id = "bloqueTareas";
        bloqueTarea.name = "bloqueTareas";
        bloqueTarea.ariaCurrent = "true";
        bloqueTarea.style.zIndex = "1";


        if ((myTask.getVisibilidad == true && spanCabeceraTarea.innerText == "Públicas") ||
                (myTask.getIdUsuario == auth.currentUser.uid && myTask.getEstado == true && spanCabeceraTarea.innerText == "Pendientes") ||
                (myTask.getIdUsuario == auth.currentUser.uid && myTask.getEstado == false && spanCabeceraTarea.innerText == "Completadas")
                ) {

            bloqueTarea.onclick = () => {
                document.getElementById("loader").style.display = "block";
                if (myTask.getEstado && myTask.getIdUsuario == auth.currentUser.uid) {
                    window.location.href = "\NewTask.html?" + myTask.getId;
                } else {
                    generateToast("Error de verificación", "Esta tarea no se puede modificar por este usuario.", (today.getHours() + ":" + today.getMinutes()), 2000);
                }
                document.getElementById("loader").style.display = "none";
            }

            var divTareaButtons = document.createElement("div");
            divTareaButtons.className = "multi-button";
            divTareaButtons.id = "multiButton";

            var btnFinish = document.createElement("button");
            btnFinish.className = "fa-solid fa-flag-checkered";
            btnFinish.onclick = () => {
                document.getElementById("loader").style.display = "block";
                finishTask(myTask);
                document.getElementById("tabLinkCompletadas").click();
                document.getElementById("loader").style.display = "none";
            }

            var btnEdit = document.createElement("button");
            btnEdit.className = "fas fa-edit";
            btnEdit.onclick = () => {
                document.getElementById("loader").style.display = "block";
                if (myTask.getEstado && myTask.getIdUsuario == auth.currentUser.uid) {
                    window.location.href = "\NewTask.html?" + myTask.getId;
                } else {
                    generateToast("Error de verificación", "Esta tarea no se puede modificar por este usuario.", (today.getHours() + ":" + today.getMinutes()), 2000);
                }
                document.getElementById("loader").style.display = "none";
            }

            var btnShare = document.createElement("button");
            btnShare.className = "fas fa-share-alt";
            btnShare.onclick = () => {
                document.getElementById("loader").style.display = "block";
                shareTask(myTask);
                document.getElementById("tabLinkPublicas").click();
                document.getElementById("loader").style.display = "none";
            };

            var btnTrash = document.createElement("button");
            btnTrash.className = "fas fa-trash";
            btnTrash.onclick = () => {
                document.getElementById("loader").style.display = "block";
                deleteTask(myTask.getNombre, myTask.getId, myTask.getIdUsuario);
                document.getElementById("tabLinkPendientes").click();
                document.getElementById("loader").style.display = "none";
            }


            divTareaButtons.appendChild(btnFinish);
            divTareaButtons.appendChild(btnEdit);
            divTareaButtons.appendChild(btnShare);
            divTareaButtons.appendChild(btnTrash);
            var divDetallesTareas = document.createElement("div");
            divDetallesTareas.className = "d-flex w-100 align-items-center justify-content-between";
            var cabeceraDetalleTarea = document.createElement("strong");
            cabeceraDetalleTarea.className = "mb-1";
            cabeceraDetalleTarea.innerHTML += myTask.getNombre;
            var fechaTarea = document.createElement('small');
            fechaTarea.innerHTML += myTask.getHoraCreacion + " | " + myTask.getFechaFin;
            divDetallesTareas.appendChild(cabeceraDetalleTarea);
            divDetallesTareas.appendChild(fechaTarea);
            var divDescripcionTarea = document.createElement("div");
            divDescripcionTarea.className = "col-10 mb-1 small";
            divDescripcionTarea.innerHTML += myTask.getDescripcion;
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

            var dateToday = parseDate(today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
            var dateTask = parseDate(myTask.getFechaFin);

            var divider = document.createElement("div");
            divider.className = "divider d-flex";
            divider.style.height = "5px";


            switch (myTask.getPrioridad) {
                case "Alta":
                    if (dateToday == dateTask) {
                        fechaTarea.innerHTML += "<lord-icon src='https://cdn.lordicon.com/mbyiiqnh.json'trigger='loop' title='Termina hoy!' colors='primary:#121331,secondary:#08a88a' style='width:35px;height:35px' ></lord-icon>"
                    }
                    bloqueTarea.style.borderLeft = "5px solid red";
                    divTareasPrioridadAlta.appendChild(bloqueTarea);
                    divTareasPrioridadAlta.appendChild(divider);
                    break;
                case "Media":
                    if (dateToday == dateTask) {
                        fechaTarea.innerHTML += "<lord-icon src='https://cdn.lordicon.com/mbyiiqnh.json'trigger='loop' title='Termina hoy!' colors='primary:#121331,secondary:#08a88a' style='width:35px;height:35px' ></lord-icon>"
                        bloqueTarea.style.borderLeft = "5px solid yellow";
                        divTareasPrioridadAlta.appendChild(bloqueTarea);
                        divTareasPrioridadAlta.appendChild(divider);
                    } else {
                        bloqueTarea.style.borderLeft = "5px solid yellow";
                        divTareasPrioridadMedia.appendChild(bloqueTarea);
                        divTareasPrioridadMedia.appendChild(divider);
                    }
                    break;
                case "Baja":
                    if (dateToday == dateTask) {
                        fechaTarea.innerHTML += "<lord-icon src='https://cdn.lordicon.com/mbyiiqnh.json'trigger='loop' colors='primary:#121331,secondary:#08a88a' style='width:40px;height:40px'></lord-icon>"
                        bloqueTarea.style.borderLeft = "5px solid green";
                        divTareasPrioridadAlta.appendChild(bloqueTarea);
                        divTareasPrioridadAlta.appendChild(divider);

                    } else {
                        bloqueTarea.style.borderLeft = "5px solid green";
                        divTareasPrioridadBaja.appendChild(bloqueTarea);
                        divTareasPrioridadBaja.appendChild(divider);
                    }
                    break;
            }

        }
        indexActual++;
    });


    divTareasGeneral.appendChild(divTareasPrioridadAlta);
    divTareasGeneral.appendChild(divTareasPrioridadMedia);
    divTareasGeneral.appendChild(divTareasPrioridadBaja);
    element.appendChild(cajaTareas);
    element.appendChild(divTareasGeneral);

}

function finishTask(myTask) {

    console.log("******** Finish Task By :   " + myTask.getNombre);
    if (myTask.getIdUsuario == auth.currentUser.uid) {

        const postData = {
            AdjuntosTarea: myTask.getAdjuntos,
            DescripcionTarea: myTask.getDescripcion,
            EstadoTarea: false,
            FechaCreacionTarea: myTask.getFechaInicio,
            HoraCreacion: myTask.getHoraCreacion,
            FechaVencimientoTarea: myTask.getFechaFin,
            IDPadre: myTask.getIdPadre,
            IDTarea: myTask.getId,
            IDUsuario: myTask.getIdUsuario,
            NombreTarea: myTask.getNombre,
            PrioridadTarea: myTask.getPrioridad,
            VisibilidadTarea: myTask.getVisibilidad
        };

        changeData("Tareas", myTask.getId, postData);

    }
}

function multiButtonHover(element) {
    var firstchild = element.firstChild;
    firstchild.style.display = "block";
    element.style.backgroundColor = "aliceblue";
}

function removeButtonHover(element) {
    var firstchild = element.firstChild;
    firstchild.style.display = "none";
    element.style.backgroundColor = "white";

}

var elementSearchText = document.getElementById("searchText");
elementSearchText.oninput = () => {
    var loader = document.getElementById("loader");
    loader.style.display = "block";
    var divTareasPrioridadAlta = document.getElementById("prioridadAlta");
    var divTareasPrioridadMedia = document.getElementById("prioridadMedia");
    var divTareasPrioridadBaja = document.getElementById("prioridadBaja");
    var spanCabeceraTarea = document.getElementById("taskListCabecera");
    spanCabeceraTarea.innerHTML = "Búsqueda Personalizada";
    divTareasPrioridadAlta.innerHTML = "";
    divTareasPrioridadMedia.innerHTML = "";
    divTareasPrioridadBaja.innerHTML = "";


    myFirebaseTasks.forEach((myTask) => {
        if (myTask.getNombre.toLowerCase().includes(preventCodeInjection(elementSearchText.value).toLowerCase()) && preventCodeInjection(elementSearchText.value) != "") {
            loadNewTask(myTask);
        }
    });
    if (elementSearchText.value == "") {
        document.getElementById("tabLinkPendientes").click();
    }
    loader.style.display = "none";

};


fotoPerfil.onerror = () => {
    fotoPerfil.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
    console.log("ha fallado")
};

var btnSignOut = document.getElementById("signOut");
btnSignOut.onclick = () => {
    document.getElementById("loader").style.display = "block";
    UserSignOut();
    document.getElementById("loader").style.display = "none";
};
var eTablinkPendiente = document.getElementById("tabLinkPendientes");

eTablinkPendiente.onclick = () => {
    indexActual = 0;
    document.getElementById("loader").style.display = "block";
    openTasks(eTablinkPendiente, 'tabLinkPendientes');
    document.getElementById("loader").style.display = "none";
    bloqueTareasSelection = document.getElementsByName("bloqueTareas");


    if (bloqueTareasSelection.length != 0) {
        setObserver();
    }

};
var eTablinkCompletadas = document.getElementById("tabLinkCompletadas");
eTablinkCompletadas.onclick = () => {
    indexActual = 0;
    document.getElementById("loader").style.display = "block";
    openTasks(eTablinkCompletadas, 'tabLinkCompletadas');
    document.getElementById("loader").style.display = "none";

    bloqueTareasSelection = document.getElementsByName("bloqueTareas");


    if (bloqueTareasSelection.length != 0) {
        setObserver();
    }
};
var eTablinkPublicas = document.getElementById("tabLinkPublicas");
eTablinkPublicas.onclick = () => {
    indexActual = 0;
    document.getElementById("loader").style.display = "block";
    openTasks(eTablinkPublicas, 'tabLinkPublicas');
    document.getElementById("loader").style.display = "none";
    bloqueTareasSelection = document.getElementsByName("bloqueTareas");


    if (bloqueTareasSelection.length != 0) {
        setObserver();
    }
};




