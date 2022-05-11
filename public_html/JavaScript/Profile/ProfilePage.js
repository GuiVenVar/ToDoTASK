/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import { ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { firebase, analytics, auth, db, storage, UserSignOut, loadProfilePicture, changeData} from "../Connection/BBDDFunctions.js";
import { parseDate, generateToast} from "../JSFunctions.js";


const fotoPerfil = document.getElementById("fotoPerfil");
const fotoPerfilNav = document.getElementById("fotoPerfilNav");
const nombreUsuario = document.getElementById("nombreUsuario");
const fechaNacimiento = document.getElementById("fechaNacimiento");
const bibliografiaUsuario = document.getElementById("bibliografiaUsuario");
const backgroundUploadPhoto = document.getElementById("file-upload");
const editBtn = document.getElementById("btnEdit");
const btnSignOut = document.getElementById("signOut");


backgroundUploadPhoto.style.backgroundImage = "url(https://www.freeiconspng.com/uploads/upload-icon-30.png)";

function loadData() {
    auth.onAuthStateChanged(function (user) {
        if (user) {
            const userRef = databaseRef(db, 'Usuarios/' + auth.currentUser.uid);
            onValue(userRef, (snapshot) => {

                const data = snapshot.val();
                loadProfilePicture(fotoPerfilNav);
                loadProfilePicture(fotoPerfil);

                var divDatos = document.createElement("div");
                divDatos.id = "divDatos";

                nombreUsuario.innerHTML = data.NombreUsuario + " " + data.ApellidosUsuario;

                var myHR = document.createElement("hr");

                nombreUsuario.appendChild(myHR);

                var myDateString = parseDate(data.EdadUsuario);

                fechaNacimiento.innerHTML = "";
                fechaNacimiento.innerHTML = "<b>Fecha de nacimiento:</b> " + myDateString;

                var myBR = document.createElement("br");

                var paragraphTelefono = document.createElement("p");
                paragraphTelefono.innerHTML = "<b>Telefono:</b> " + data.TelefonoUsuario;

                var paragraphEmpresa = document.createElement("p");
                paragraphEmpresa.innerHTML = "<b>Empresa:</b> " + data.EmpresaUsuario;

                var paragraphCargo = document.createElement("p");
                paragraphCargo.innerHTML = "<b>Cargo:</b> " + data.CargoUsuario;

                divDatos.innerHTML = "";
                divDatos.appendChild(myBR);
                divDatos.appendChild(paragraphTelefono);
                divDatos.appendChild(paragraphEmpresa);
                divDatos.appendChild(paragraphCargo);
                fechaNacimiento.appendChild(divDatos);


                var paragraphBibliografia = document.createElement("p");
                paragraphBibliografia.innerHTML = "<b>Bibliografía:</b> <p style='height:100%;width:100%;'>" + data.BibliografiaUsuario + "</p>";

                bibliografiaUsuario.innerHTML = "";
                bibliografiaUsuario.appendChild(paragraphBibliografia);


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

                nombreUsuario.innerHTML = data.NombreUsuario + " " + data.ApellidosUsuario;

                var myHR = document.createElement("hr");

                nombreUsuario.appendChild(myHR);

                var myDateString = parseDate(data.EdadUsuario);

                fechaNacimiento.innerHTML = "";
                fechaNacimiento.innerHTML = "Fecha de Nacimiento: <input type='date' id='fechaNacimientoMod' value='" + myDateString + "'/>";

                var myBR = document.createElement("br");

                var paragraphTelefono = document.createElement("p");
                paragraphTelefono.innerHTML = "Telefono: " + "<input type='text' id='telefonoMod' value='" + data.TelefonoUsuario + "'/>";

                var paragraphEmpresa = document.createElement("p");
                paragraphEmpresa.innerHTML = "Empresa: <input type='text' id='empresaMod' value='" + data.EmpresaUsuario + "'/>";

                var paragraphCargo = document.createElement("p");
                paragraphCargo.innerHTML = "Cargo: <input type='text' id='cargoMod' value='" + data.CargoUsuario + "'/>";

                divDatos.innerHTML = "";
                divDatos.appendChild(myBR);
                divDatos.appendChild(paragraphTelefono);
                divDatos.appendChild(paragraphEmpresa);
                divDatos.appendChild(paragraphCargo);
                fechaNacimiento.appendChild(divDatos);


                var paragraphBibliografia = document.createElement("p");
                paragraphBibliografia.innerHTML = "Bibliografía: <textarea class='textarea resize-ta w-100' id='bibliografiaMod'>" + data.BibliografiaUsuario + "</textarea>";

                bibliografiaUsuario.innerHTML = "";

                var btnEditarCambios = document.createElement("input");
                btnEditarCambios.value = "Guardar";
                btnEditarCambios.type = "button";
                btnEditarCambios.id = "btnEditarCambios";

                btnEditarCambios.onclick = () => {
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
                                ApellidosUsuario: data.ApellidosUsuario,
                                BibliografiaUsuario: bibliografiaMod,
                                CargoUsuario: cargoMod,
                                EdadUsuario: parseDate(fechaNacimientoMod),
                                EmpresaUsuario: empresaMod,
                                IDUsuario: data.IDUsuario,
                                NombreUsuario: data.NombreUsuario,
                                TelefonoUsuario: telefonoMod
                            };


                            changeData("Usuarios", auth.currentUser.uid, postData);


                        }
                    } else {
                        generateToast("Error de verificación", "Revisa los datos , ha fallado alguno !", (today.getHours() + ":" + today.getMinutes()), 5000);

                    }

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

    var myFile = backgroundUploadPhoto.files;

    if (myFile[0].size > ((5 * 1024) * 1024)) {
        generateToast("Error de verificación", "El archivo es muy grande , máximo 5MB!", (today.getHours() + ":" + today.getMinutes()), 5000);

    } else {

        var fileName = auth.currentUser.uid + ".jpg";

        uploadBytes(storageRef(storage, 'photoUser/' + fileName), myFile[0]).then((snapshot) => {
            console.log(snapshot);
            console.log("subiendo datos...");
        }).catch((error) => {
            console.log("Error subiendo el archivo  ! \n " + error.message);
        }).finally(() => {
            console.log("Cargada !");
            location.reload();
        });
    }
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