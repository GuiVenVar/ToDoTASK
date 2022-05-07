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
                if (snapshot.val().PhotoPathUsuario != "\\") {

                    const data = snapshot.val();

                    loadProfilePicture();


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

                } else {
                    fotoPerfil.src = "https://restorixhealth.com/wp-content/uploads/2018/08/No-Image.png";
                    fotoPerfilNav.src = "https://restorixhealth.com/wp-content/uploads/2018/08/No-Image.png";
                }
            });
        } else {

            alert("Usuario deslogueado !");
            window.location.href = "..\\Index.html";
        }
    });
}

function UserSignOut() {

    signOut(auth).then(() => {
        window.location.href = "..\\Index.html";
    }).catch((error) => {
        console.log("Error desconectando !");
    });

}

function editData() {

    getAuth().onAuthStateChanged(function (user) {
        if (user) {
            const userRef = databaseRef(db, 'Usuarios/' + getAuth().currentUser.uid);
            onValue(userRef, (snapshot) => {

                const data = snapshot.val();

                loadProfilePicture();


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
                            alert("El telefono ha de tener 9 digitos !");
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

                            const updates = {};
                            updates["Usuarios/" + auth.currentUser.uid] = postData;

                            update(databaseRef(db), updates)
                                    .then(() => {
                                        alert("Se ha modificado correctamente.");
                                        window.location.reload();
                                    })
                                    .catch(() => {
                                        alert("Ha fallado la modificación");
                                        window.location.reload();
                                    });

                        }
                    }
                    else{
                        alert("Ha fallado algo en la verificación");
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

            alert("Usuario deslogueado !");
            window.location.href = "..\\Index.html";
        }
    });


}

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

function loadProfilePicture() {

    getDownloadURL(storageRef(storage, 'gs://tododaw.appspot.com/photoUser/' + auth.currentUser.uid + ".jpg"))
            .then((url) => {

                fotoPerfil.src = url;
                fotoPerfilNav.src = url;
                console.log("Cargadas");

            })
            .catch((error) => {
                console.log("Error cargando datos loadProfilePicture => " + error.message);
            }).finally(() => {

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

    if (myFile[0].size > ((10 * 1024) * 1024)) {
        alert("File is too big!");
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



loadData();