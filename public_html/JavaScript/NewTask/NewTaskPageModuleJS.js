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

const fotoPerfil = document.getElementById("fotoPerfilNav");

getAuth().onAuthStateChanged(function (user) {
    if (user) {
        const userRef = ref(db, 'Usuarios/' + getAuth().currentUser.uid);
        onValue(userRef, (snapshot) => {
            loadProfilePicture();
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

var btnSignOut = document.getElementById("signOut");
btnSignOut.onclick = () => {
    UserSignOut()
};

