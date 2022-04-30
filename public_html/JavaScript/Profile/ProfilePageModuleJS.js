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
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);
const db = getDatabase();
const usuarioAuth = getAuth();
const fotoPerfil = document.getElementById("fotoPerfil");
const fotoPerfilNav = document.getElementById("fotoPerfilNav");
const nombreUsuario = document.getElementById("nombreUsuario");
const fechaNacimiento = document.getElementById("fechaNacimiento");
const bibliografiaUsuario = document.getElementById("bibliografiaUsuario");
const backgroundUploadPhoto = document.getElementById("file-upload");


backgroundUploadPhoto.style.backgroundImage = "url(https://www.freeiconspng.com/uploads/upload-icon-30.png)";


getAuth().onAuthStateChanged(function (user) {
    if (user) {
        const userRef = ref(db, 'Usuarios/' + getAuth().currentUser.uid);
        onValue(userRef, (snapshot) => {
            if (snapshot.val().PhotoPathUsuario != "\\") {
                const data = snapshot.val();
                fotoPerfil.src = data.PhotoPathUsuario;
                fotoPerfilNav.src = data.PhotoPathUsuario;


                var divDatos = document.createElement("div");
                divDatos.id = "divDatos";

                nombreUsuario.innerHTML = data.NombreUsuario + " " + data.ApellidosUsuario;

                var myHR = document.createElement("hr");

                nombreUsuario.appendChild(myHR);

                var myDate = new Date(data.EdadUsuario);

                fechaNacimiento.innerHTML = "";
                fechaNacimiento.innerHTML = "Fecha de nacimiento: " + (myDate.getDay() - 1) + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear();

                var myBR = document.createElement("br");

                var paragraphTelefono = document.createElement("p");
                paragraphTelefono.innerHTML = "Telefono: " + data.TelefonoUsuario;

                var paragraphEmpresa = document.createElement("p");
                paragraphEmpresa.innerHTML = "Empresa " + data.EmpresaUsuario;

                var paragraphCargo = document.createElement("p");
                paragraphCargo.innerHTML = "Cargo: " + data.CargoUsuario;

                divDatos.innerHTML = "";
                divDatos.appendChild(myBR);
                divDatos.appendChild(paragraphTelefono);
                divDatos.appendChild(paragraphEmpresa);
                divDatos.appendChild(paragraphCargo);
                fechaNacimiento.appendChild(divDatos);


                var paragraphBibliografia = document.createElement("p");
                paragraphBibliografia.innerHTML = "Bibliografía: " + data.BibliografiaUsuaro;

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

function UserSignOut() {

    const auth = getAuth();
    signOut(auth).then(() => {
        window.location.href = "..\\Index.html";
    }).catch((error) => {
        console.log("Error desconectando !");
    });

}

function editData() {



}

var btnSignOut = document.getElementById("signOut");
btnSignOut.onclick = function () {
    UserSignOut()
};
