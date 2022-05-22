/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import { ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { firebase, analytics, auth, db, storage, UserSignOut, loadProfilePicture, uploadProfilePicture, changeData} from "../Connection/BBDDFunctions.js";
import { parseDate, generateToast, generateLoader, preventCodeInjection} from "../JSFunctions.js";
import { Usuarios } from "../Models/Usuarios.js";
const fotoPerfil = document.getElementById("fotoPerfil");
const fotoPerfilNav = document.getElementById("fotoPerfilNav");
const nombreUsuario = document.getElementById("nombreUsuario");
const fechaNacimiento = document.getElementById("fechaNacimiento");
const bibliografiaUsuario = document.getElementById("bibliografiaUsuario");
const backgroundUploadPhoto = document.getElementById("file-upload");
const editBtn = document.getElementById("btnEdit");
const btnSignOut = document.getElementById("signOut");
var today = new Date();
var usuario = null;
var loader = generateLoader();
loader.style.top = "0";
document.body.appendChild(loader);
backgroundUploadPhoto.style.backgroundImage = "url(https://www.freeiconspng.com/uploads/upload-icon-30.png)";
function loadData() {


    auth.onAuthStateChanged(function (user) {
        if (user) {
            const userRef = databaseRef(db, 'Usuarios/' + auth.currentUser.uid);
            onValue(userRef, (snapshot) => {

                loader.style.display = "block";
                const data = snapshot.val();
                usuario = new Usuarios(
                        auth.currentUser.uid,
                        preventCodeInjection(data.NombreUsuario),
                        preventCodeInjection(data.ApellidosUsuario),
                        preventCodeInjection(data.TelefonoUsuario),
                        preventCodeInjection(data.EdadUsuario),
                        preventCodeInjection(data.EmpresaUsuario),
                        preventCodeInjection(data.CargoUsuario),
                        preventCodeInjection(data.BibliografiaUsuario));
                loadProfilePicture(fotoPerfilNav);
                loadProfilePicture(fotoPerfil);
                var divDatos = document.createElement("div");
                divDatos.id = "divDatos";
                nombreUsuario.innerHTML = preventCodeInjection(usuario.getNombre) + " " + preventCodeInjection(usuario.getApellido);
                var myHR = document.createElement("hr");
                nombreUsuario.appendChild(myHR);
                var myDateString = parseDate(usuario.getEdad);
                fechaNacimiento.innerHTML = "";
                fechaNacimiento.innerHTML = "<b>Fecha de nacimiento:</b> " + preventCodeInjection(myDateString);
                var myBR = document.createElement("br");
                var paragraphTelefono = document.createElement("p");
                paragraphTelefono.innerHTML = "<b>Telefono:</b> " + preventCodeInjection(usuario.getTelefono);
                var paragraphEmpresa = document.createElement("p");
                paragraphEmpresa.innerHTML = "<b>Empresa:</b> " + preventCodeInjection(usuario.getEmpresa);
                var paragraphCargo = document.createElement("p");
                paragraphCargo.innerHTML = "<b>Cargo:</b> " + preventCodeInjection(usuario.getCargo);
                divDatos.innerHTML = "";
                divDatos.appendChild(myBR);
                divDatos.appendChild(paragraphTelefono);
                divDatos.appendChild(paragraphEmpresa);
                divDatos.appendChild(paragraphCargo);
                fechaNacimiento.appendChild(divDatos);
                var paragraphBibliografia = document.createElement("p");
                paragraphBibliografia.innerHTML = "<b>Bibliografía:</b> <p style='height:100%;width:100%;'>" + preventCodeInjection(usuario.getBibliografia) + "</p>";
                bibliografiaUsuario.innerHTML = "";
                bibliografiaUsuario.appendChild(paragraphBibliografia);
                loader.style.display = "none";
            });
        } else {
            generateToast("Autenticación", "Usuario deslogueado !", (today.getHours() + ":" + today.getMinutes()), 2000);
            setTimeout(function () {
                location.href = "..\\Index.html"
            }, 2000);
        }
    });
}

function editData() {

    auth.onAuthStateChanged(function (user) {
        if (user) {
            const userRef = databaseRef(db, 'Usuarios/' + auth.currentUser.uid);
            onValue(userRef, (snapshot) => {

                const data = snapshot.val();
                loadProfilePicture(fotoPerfil);
                var divDatos = document.createElement("div");
                divDatos.id = "divDatos";
                nombreUsuario.innerHTML = preventCodeInjection(data.NombreUsuario) + " " + preventCodeInjection(data.ApellidosUsuario);
                var myHR = document.createElement("hr");
                nombreUsuario.appendChild(myHR);
                var myDateString = parseDate(data.EdadUsuario);
                fechaNacimiento.innerHTML = "";
                fechaNacimiento.innerHTML = "Fecha de Nacimiento: <input type='date' id='fechaNacimientoMod' value='" + preventCodeInjection(myDateString) + "'/>";
                var myBR = document.createElement("br");
                var paragraphTelefono = document.createElement("p");
                paragraphTelefono.innerHTML = "Telefono: " + "<input type='text' id='telefonoMod' value='" + preventCodeInjection(data.TelefonoUsuario) + "'/>";
                var paragraphEmpresa = document.createElement("p");
                paragraphEmpresa.innerHTML = "Empresa: <input type='text' id='empresaMod' value='" + preventCodeInjection(data.EmpresaUsuario) + "'/>";
                var paragraphCargo = document.createElement("p");
                paragraphCargo.innerHTML = "Cargo: <input type='text' id='cargoMod' value='" + preventCodeInjection(data.CargoUsuario) + "'/>";
                divDatos.innerHTML = "";
                divDatos.appendChild(myBR);
                divDatos.appendChild(paragraphTelefono);
                divDatos.appendChild(paragraphEmpresa);
                divDatos.appendChild(paragraphCargo);
                fechaNacimiento.appendChild(divDatos);
                var paragraphBibliografia = document.createElement("p");
                paragraphBibliografia.innerHTML = "Bibliografía: <textarea class='textarea resize-ta w-100' id='bibliografiaMod'>" + preventCodeInjection(data.BibliografiaUsuario) + "</textarea>";
                bibliografiaUsuario.innerHTML = "";
                var btnEditarCambios = document.createElement("input");
                btnEditarCambios.value = "Guardar";
                btnEditarCambios.type = "button";
                btnEditarCambios.id = "btnEditarCambios";
                btnEditarCambios.onclick = () => {

                    loader.style.display = "block";
                    var fechaNacimientoMod = document.getElementById("fechaNacimientoMod").value;
                    var telefonoMod = document.getElementById("telefonoMod").value;
                    var empresaMod = document.getElementById("empresaMod").value;
                    var cargoMod = document.getElementById("cargoMod").value;
                    var bibliografiaMod = document.getElementById("bibliografiaMod").value;
                    if (fechaNacimientoMod != data.EdadUsuario && fechaNacimientoMod != "" ||
                            telefonoMod != data.TelefonoUsuario && telefonoMod != "" ||
                            empresaMod != data.EmpresaUsuario && empresaMod != "" ||
                            cargoMod != data.CargoUsuario && cargoMod != "" ||
                            bibliografiaMod != data.BibliografiaUsuario && bibliografiaMod != "") {

                        if (telefonoMod.length != 9) {
                            generateToast("Error de verificación", "El telefono ha de tener 9 digitos !", (today.getHours() + ":" + today.getMinutes()), 5000);
                        } else {

                            const postData = {
                                ApellidosUsuario: preventCodeInjection(data.ApellidosUsuario),
                                BibliografiaUsuario: preventCodeInjection(bibliografiaMod),
                                CargoUsuario: preventCodeInjection(cargoMod),
                                EdadUsuario: parseDate(fechaNacimientoMod),
                                EmpresaUsuario: preventCodeInjection(empresaMod),
                                IDUsuario: data.IDUsuario,
                                NombreUsuario: preventCodeInjection(data.NombreUsuario),
                                TelefonoUsuario: telefonoMod
                            };
                            changeData("Usuarios", auth.currentUser.uid, postData);
                            setTimeout(function () {

                                location.reload();

                            }, 1000);


                        }
                    } else {
                        generateToast("Error de verificación", "Revisa los datos , ha fallado alguno !", (today.getHours() + ":" + today.getMinutes()), 5000);
                    }
                    loader.style.display = "none";
                }

                var btnCancelarCambios = document.createElement("input");
                btnCancelarCambios.value = "Cancelar";
                btnCancelarCambios.type = "button";
                btnCancelarCambios.id = "btnCancelarCambios";
                btnCancelarCambios.onclick = () => loadData();
                bibliografiaUsuario.appendChild(paragraphBibliografia);
                bibliografiaUsuario.appendChild(btnEditarCambios);
                bibliografiaUsuario.appendChild(btnCancelarCambios);
            });
        } else {
            generateToast("Error de autenticación", "Usuario deslogueado !", (today.getHours() + ":" + today.getMinutes()), 2000);
            setTimeout(function () {
                location.href = "..\\Index.html";
            }, 2000);
        }
    });
}

btnSignOut.onclick = () => {
    UserSignOut()
};
btnEdit.onclick = () => {

    if (document.getElementById("fechaNacimientoMod")) {
        loadData();
    } else {
        editData();
    }
}

backgroundUploadPhoto.onchange = () => {

    loader.style.display = "block";
    var myFile = backgroundUploadPhoto.files;
    if (myFile[0].size > ((5 * 1024) * 1024)) {
        generateToast("Error de verificación", "El archivo es muy grande , máximo 5MB!", (today.getHours() + ":" + today.getMinutes()), 5000);
    } else {

        var fileName = auth.currentUser.uid + ".jpg";
        document.getElementById("loader")
        uploadProfilePicture(fileName, myFile[0]);
    }
    loader.style.display = "none";
}


fotoPerfilNav.onerror = () => {

    console.log("Ha fallado la carga del Nav");
    fotoPerfilNav.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
}
fotoPerfil.onerror = () => {
    console.log("Ha fallado la carga del perfil");
    fotoPerfil.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
}


loadData();

