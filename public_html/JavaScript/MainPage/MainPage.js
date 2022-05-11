/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { firebase, analytics, auth, db, storage, UserSignOut, deleteTask, shareTask, loadProfilePicture, changeData } from "../Connection/BBDDFunctions.js";
import { parseDate, generateToast} from "../JSFunctions.js";

const loader = document.getElementById("loader");
const fotoPerfil = document.getElementById("fotoPerfil");

var today = new Date();

auth.onAuthStateChanged(function (user) {
    if (user) {

        const userRef = ref(db, 'Usuarios/' + auth.currentUser.uid);
        onValue(userRef, (snapshot) => {

            loadProfilePicture(document.getElementById("fotoPerfil"));

        }, (error) => {
            console.log(error.message)
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
            const dbTareas = ref(db, 'Tareas/')

            onValue(dbTareas, (snapshot) => {
                divTareasPrioridadAlta.innerHTML = "";
                divTareasPrioridadMedia.innerHTML = "";
                divTareasPrioridadBaja.innerHTML = "";

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
                    bloqueTarea.name = "bloqueTareas";
                    bloqueTarea.ariaCurrent = "true";
                    bloqueTarea.style.zIndex = "1";
                    if ((childSnap.val().VisibilidadTarea == true && spanCabeceraTarea.innerText == "Públicas") ||
                            (childSnap.val().IDUsuario == auth.currentUser.uid && childSnap.val().EstadoTarea == true && spanCabeceraTarea.innerText == "Pendientes") ||
                            (childSnap.val().IDUsuario == auth.currentUser.uid && childSnap.val().EstadoTarea == false && spanCabeceraTarea.innerText == "Completadas")
                            ) {

                        var divTareaButtons = document.createElement("div");
                        divTareaButtons.className = "multi-button";
                        divTareaButtons.id = "multiButton";

                        var btnFinish = document.createElement("button");
                        btnFinish.className = "fa-solid fa-flag-checkered";
                        btnFinish.onclick = () => finishTask(childSnap);

                        var btnEdit = document.createElement("button");
                        btnEdit.className = "fas fa-edit";
                        btnEdit.onclick = () => {
                            console.log(childSnap.val().EstadoTarea + "\n" + childSnap.val().IDUsuario + "\n" + user.uid)
                            if (childSnap.val().EstadoTarea && childSnap.val().IDUsuario == auth.currentUser.uid) {
                                window.location.href = "\NewTask.html?" + childSnap.val().IDTarea;
                            } else {
                                generateToast("Error de verificación", "Esta tarea no se puede modificar por este usuario.", (today.getHours() + ":" + today.getMinutes()), 2000);
                            }
                        }

                        var btnShare = document.createElement("button");
                        btnShare.className = "fas fa-share-alt";
                        btnShare.onclick = () => {
                            shareTask(childSnap)
                        };

                        var btnTrash = document.createElement("button");
                        btnTrash.className = "fas fa-trash";
                        btnTrash.onclick = () => {
                            deleteTask(childSnap.val().IDTarea, childSnap.val().IDUsuario);
                        }

                        divTareaButtons.appendChild(btnFinish);
                        divTareaButtons.appendChild(btnEdit);
                        divTareaButtons.appendChild(btnShare);
                        divTareaButtons.appendChild(btnTrash);
                        var divDetallesTareas = document.createElement("div");
                        divDetallesTareas.className = "d-flex w-100 align-items-center justify-content-between";
                        var cabeceraDetalleTarea = document.createElement("strong");
                        cabeceraDetalleTarea.className = "mb-1";
                        cabeceraDetalleTarea.innerHTML += childSnap.val().NombreTarea;
                        var fechaTarea = document.createElement('small');
                        fechaTarea.innerHTML += childSnap.val().FechaVencimientoTarea;
                        divDetallesTareas.appendChild(cabeceraDetalleTarea);
                        divDetallesTareas.appendChild(fechaTarea);
                        var divDescripcionTarea = document.createElement("div");
                        divDescripcionTarea.className = "col-10 mb-1 small";
                        divDescripcionTarea.innerHTML += childSnap.val().DescripcionTarea;
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
                        var dateTask = parseDate(childSnap.val().FechaVencimientoTarea);

                        var divider = document.createElement("div");
                        divider.className = "divider d-flex";
                        divider.style.height = "5px";
                        if (childSnap.val().PrioridadTarea == "Alta") {

                            if (dateToday == dateTask) {
                                fechaTarea.innerHTML += "<lord-icon src='https://cdn.lordicon.com/mbyiiqnh.json'trigger='loop' title='Termina hoy!' colors='primary:#121331,secondary:#08a88a' style='width:35px;height:35px' ></lord-icon>"
                            }
                            bloqueTarea.style.borderLeft = "5px solid red";
                            divTareasPrioridadAlta.appendChild(bloqueTarea);
                            divTareasPrioridadAlta.appendChild(divider);


                        } else if (childSnap.val().PrioridadTarea == "Media") {
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
                        } else if (childSnap.val().PrioridadTarea == "Baja") {
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


            const dbTareas = ref(db, 'Tareas/')
            onValue(dbTareas, (snapshot) => {
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

                cajaTareas.appendChild(spanCabeceraTarea);
                divTareasGeneral.appendChild(cajaTareas);


                snapshot.forEach(function (childSnap) {

                    var bloqueTareas = document.createElement("a");
                    bloqueTareas.href = "#";
                    bloqueTareas.className = "list-group-item list-group-item-action py-3 lh-tight";
                    bloqueTareas.id = "bloqueTareas";
                    bloqueTareas.ariaCurrent = "true";
                    bloqueTareas.style.zIndex = "1";

                    if (childSnap.val().NombreTarea.toLowerCase().includes(elementSearchText.value.toLowerCase())) {

                        var divTareaButtons = document.createElement("div");
                        divTareaButtons.className = "multi-button";
                        divTareaButtons.id = "multiButton";


                        var btnFinish = document.createElement("button");
                        btnFinish.className = "fa-solid fa-flag-checkered";
                        btnFinish.onclick = () => finishTask(childSnap);

                        var btnEdit = document.createElement("button");
                        btnEdit.className = "fas fa-edit";
                        btnEdit.onclick = () => {
                            console.log(childSnap.val().EstadoTarea + "\n" + childSnap.val().IDUsuario + "\n" + user.uid)
                            if (childSnap.val().EstadoTarea && childSnap.val().IDUsuario == auth.currentUser.uid) {
                                window.location.href = "\NewTask.html?" + childSnap.val().IDTarea;
                            } else {
                                generateToast("Error de verificación", "Esta tarea no se puede modificar por este usuario.", (today.getHours() + ":" + today.getMinutes()), 2000);
                            }
                        }

                        var btnShare = document.createElement("button");
                        btnShare.className = "fas fa-share-alt";
                        btnShare.onclick = () => {
                            shareTask(childSnap)
                        };

                        var btnTrash = document.createElement("button");
                        btnTrash.className = "fas fa-trash";
                        btnTrash.onclick = () => {
                            deleteTask(childSnap.val().IDTarea, childSnap.val().IDUsuario);
                        };

                        divTareaButtons.appendChild(btnFinish);
                        divTareaButtons.appendChild(btnEdit);
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


                        var dateToday = parseDate(today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
                        var dateTask = parseDate(childSnap.val().FechaVencimientoTarea);

                        var divider = document.createElement("div");
                        divider.className = "divider d-flex";
                        divider.style.height = "5px";
                        if (childSnap.val().PrioridadTarea == "Alta") {

                            if (dateToday == dateTask) {
                                fechaTarea.innerHTML += "<lord-icon src='https://cdn.lordicon.com/mbyiiqnh.json'trigger='loop' title='Termina hoy!' colors='primary:#121331,secondary:#08a88a' style='width:35px;height:35px' ></lord-icon>"
                            }
                            bloqueTareas.style.borderLeft = "5px solid red";
                            divTareasGeneral.appendChild(bloqueTareas);
                            divTareasGeneral.appendChild(divider);


                        } else if (childSnap.val().PrioridadTarea == "Media") {
                            if (dateToday == dateTask) {
                                fechaTarea.innerHTML += "<lord-icon src='https://cdn.lordicon.com/mbyiiqnh.json'trigger='loop' title='Termina hoy!' colors='primary:#121331,secondary:#08a88a' style='width:35px;height:35px' ></lord-icon>"
                                bloqueTareas.style.borderLeft = "5px solid yellow";
                                divTareasGeneral.appendChild(bloqueTareas);
                                divTareasGeneral.appendChild(divider);
                            } else {
                                bloqueTareas.style.borderLeft = "5px solid yellow";
                                divTareasGeneral.appendChild(bloqueTareas);
                                divTareasGeneral.appendChild(divider);
                            }
                        } else if (childSnap.val().PrioridadTarea == "Baja") {
                            if (dateToday == dateTask) {
                                fechaTarea.innerHTML += "<lord-icon src='https://cdn.lordicon.com/mbyiiqnh.json'trigger='loop' colors='primary:#121331,secondary:#08a88a' style='width:40px;height:40px'></lord-icon>"
                                bloqueTareas.style.borderLeft = "5px solid green";
                                divTareasGeneral.appendChild(bloqueTareas);
                                divTareasGeneral.appendChild(divider);

                            } else {
                                bloqueTareas.style.borderLeft = "5px solid green";
                                divTareasGeneral.appendChild(bloqueTareas);
                                divTareasGeneral.appendChild(divider);
                            }
                        }


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

    } else {
        generateToast("Información Firebase Auth", "Usuario Deslogueado !", (today.getHours() + ":" + today.getMinutes()), 2000);

        setTimeout(function () {
            location.href = "..\\Index.html";
        }, 2000);
    }
});


function finishTask(childSnap) {
    if (childSnap.val().IDUsuario == auth.currentUser.uid) {

        const postData = {
            AdjuntosTarea: childSnap.val().AdjuntosTarea,
            DescripcionTarea: childSnap.val().DescripcionTarea,
            EstadoTarea: false,
            FechaCreacionTarea: childSnap.val().FechaCreacionTarea,
            FechaVencimientoTarea: childSnap.val().FechaVencimientoTarea,
            IDPadre: childSnap.val().IDPadre,
            IDTarea: childSnap.val().IDTarea,
            IDUsuario: childSnap.val().IDUsuario,
            NombreTarea: childSnap.val().NombreTarea,
            PrioridadTarea: childSnap.val().PrioridadTarea,
            VisibilidadTarea: childSnap.val().VisibilidadTarea
        };

        changeData("Tareas", auth.currentUser.uid, postData);

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

fotoPerfil.onerror = () => {
    fotoPerfil.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
    console.log("ha fallado")
};