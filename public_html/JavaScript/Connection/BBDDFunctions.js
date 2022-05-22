/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { DataSnapshot, getDatabase, ref, get, set, child, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, getRedirectResult, signInWithPopup, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { generateToast, parseDate} from "../JSFunctions.js";

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
// Firebase Storage
const storage = getStorage();

const auth = getAuth();

export {firebase, analytics, auth, db, storage};

//const loader = document.getElementById("loader");
//const fotoPerfil = document.getElementById("fotoPerfil");

var today = new Date();


export function UserSignOut() {

    const auth = getAuth();
    signOut(auth).then(() => {
        generateToast("Autenticación", "Usuario deslogueado !", (today.getHours() + ":" + today.getMinutes()), 5000);

        setTimeout(function () {
            location.href = "..\\Index.html";
        }, 2000);
    }).catch((error) => {
        generateToast("Error de Firebase", "Error desconectando , contacta con un administrador!", (today.getHours() + ":" + today.getMinutes()));

    });
}

export function logIn(email, password) {

    if (email != "" && password != "") {

        signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    window.location.href = "Pages\\MainPage.html";
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    generateToast("Error de autenticación", "Usuario o contraseña incorrectas ! / " + error.message, (today.getHours() + ":" + today.getMinutes()), 5000);

                });
    } else {
        generateToast("Error de validación", "Usuario o contraseña vacías !", (today.getHours() + ":" + today.getMinutes()), 5000);

    }
}

export function loginFacebook() {

    var provider = new FacebookAuthProvider();
    provider.addScope('user_birthday');
    signInWithPopup(auth, provider).then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
    });
}

export function restorePassword(textEmail) {

    var textEmail = document.getElementById("correoForgot");
    if (textEmail.value != "") {

        sendPasswordResetEmail(auth,
                textEmail.value)
                .then(() => {
                    generateToast("Información", "Se ha enviado un correo de recuperación !", (today.getHours() + ":" + today.getMinutes()), 5000);


                })
                .catch(function (error) {
                    generateToast("Error de Firebase", "Ha habido un fallo en la recuperación", (today.getHours() + ":" + today.getMinutes()), 5000);


                });
    } else {
        textEmail.style.border = "1px solid red";
        generateToast("Error de validación", "No puede estár el campo del correo vacío", (today.getHours() + ":" + today.getMinutes()), 5000);


    }
}

export function registerUser(textNombre, textApellidos, textEdad, textTelefono, textEmpresa, textCargo, textEmail, textPwd, textRetypePwd) {


    var isVerified = true;
    if (textNombre.value == "") {
        textNombre.style.border = "1px solid red";
        isVerified = false;
    } else {
        textNombre.style.border = "none";
        isVerified = true;
    }
    if (textApellidos.value == "") {
        textApellidos.style.border = "1px solid red";
        isVerified = false;
    } else {
        textApellidos.style.border = "none";
        isVerified = true;
    }
    if (textEdad.value == "") {
        textEdad.style.border = "1px solid red";
        isVerified = false;
    } else {
        textEdad.style.border = "none";
        isVerified = true;
    }
    if (textTelefono.value == "" || !Number.isInteger(textTelefono.value) || textTelefono.value.length != 9) {
        textTelefono.style.border = "1px solid red";
        isVerified = false;
    } else {
        textTelefono.style.border = "none";
        isVerified = true;
    }
    if (textEmpresa.value == "") {
        textEmpresa.style.border = "1px solid red";
        isVerified = false;
    } else {
        textEmpresa.style.border = "none";
        isVerified = true;
    }
    if (textCargo.value == "") {
        textCargo.style.border = "1px solid red";
        isVerified = false;
    } else {
        textCargo.style.border = "none";
        isVerified = true;
    }
    if (textEmail.value == "" || !textEmail.value.includes("@") || !textEmail.value.includes(".")) {
        textEmail.style.border = "1px solid red";
        isVerified = false;
    } else {
        textEmail.style.border = "none";
        isVerified = true;
    }
    if (textPwd.value == "" || textPwd.value.length < 8 || textPwd.value.length > 16) {
        textPwd.style.border = "1px solid red";
        generateToast("Error de validación", "Recuerda , la contraseña no puede tener menos de 8 carácteres o más de 16 !", (today.getHours() + ":" + today.getMinutes()), 5000);
        isVerified = false;
    } else {
        textPwd.style.border = "none";
        isVerified = true;
    }
    if (textRetypePwd.value == "" || textRetypePwd.value.length < 8 || textRetypePwd.value.length > 16) {
        textRetypePwd.style.border = "1px solid red";
        generateToast("Error de validación", "Recuerda , la contraseña no puede tener menos de 8 carácteres o más de 16 !", (today.getHours() + ":" + today.getMinutes()), 5000);
        isVerified = false;
    } else {
        textRetypePwd.style.border = "none";
        isVerified = true;
    }

    if (textPwd.value != textRetypePwd.value && isVerified) {

        textPwd.style.border = "1px solid red";
        textRetypePwd.style.border = "1px solid red";
        generateToast("Error de validación", "Las contraseñas no coinciden.", (today.getHours() + ":" + today.getMinutes()), 5000);
        isVerified = false;
    }

    if (isVerified) {
        createUserWithEmailAndPassword(auth, textEmail.value, textRetypePwd.value)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    // Aqui añadimos los datos del usuario como dato en BBDD
                    set(ref(db, "Usuarios/" + user.uid), {

                        ApellidosUsuario: document.getElementById("apellidosRegistro").value,
                        BibliografiaUsuario: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a lacus posuere odio sollicitudin ornare. Aenean lectus tellus, porttitor convallis venenatis non, pulvinar eu arcu. Etiam eget velit pulvinar, eleifend enim varius, tincidunt ipsum. In ut ornare nulla. Vestibulum et sem in felis suscipit faucibus. Etiam eu elit lobortis, tincidunt diam vel, tristique magna. Pellentesque ullamcorper neque at lacinia sollicitudin. Aenean felis eros, auctor a magna quis, fermentum lacinia enim. Etiam bibendum arcu at mi vulputate, at placerat sapien fringilla. In hac habitasse platea dictumst. Suspendisse sit amet lobortis mauris, eget rutrum nisi. Curabitur volutpat mi facilisis, euismod ligula in, ornare lorem.",
                        CargoUsuario: document.getElementById("cargoEmpresaRegistro").value,
                        CorreoUsuario: document.getElementById("correoRegistro").value,
                        EdadUsuario: document.getElementById("edadRegistro").value,
                        EmpresaUsuario: document.getElementById("empresaRegistro").value,
                        IDUsuario: user.uid,
                        NombreUsuario: document.getElementById("nombreRegistro").value,
                        PhotoPathUsuario: "/",
                        TelefonoUsuario: document.getElementById("telefonoRegistro").value,
                        VisibilidadUsuario: false
                    })
                            .then(() => {
                                window.location = "Pages\\MainPage.html";
                            });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    generateToast("Error en la BBDD", error.message, (today.getHours() + ":" + today.getMinutes()), 5000);

                });
    } else {
        generateToast("Error de validación", "Verifica los datos  !", (today.getHours() + ":" + today.getMinutes()), 5000);

    }
}

export function loadTask(idTarea, btnVisibility, fechaHoy, fechaFinalizacion, labelIdTarea, inputTituloTarea, inputDescripcionTarea, selectPrioridad , horaCreacion) {

    const dbRef = ref(db, 'Tareas/' + idTarea);
    onValue(dbRef, (snapshot) => {
        if (snapshot.val() != null) {

            const data = snapshot.val();

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
            horaCreacion.value = data.HoraCreacion;

        } else {

            generateToast("Error de búsqueda", "La tarea no existe.", (today.getHours() + ":" + today.getMinutes()), 2000);
            setTimeout(function () {
                location.href = "\MainPage.html"
            }, 2000);
        }
    });

}

export function changeData(dbReference, ID, postData) {

    const updates = {};

    updates[dbReference + "/" + ID] = postData;

    update(ref(db), updates)
            .then(() => {

                generateToast("Firebase", "Se ha completado correctamente.", (today.getHours() + ":" + today.getMinutes()), 2000);
//                setTimeout(function () {
//                    if (window.location.href.includes("NewTask")) {
//                        location.href = "./MainPage.html";
//                    } else {
//                        location.reload();
//                    }
//                }, 1000);
            })
            .catch((error) => {
                generateToast("Error de Firebase", "Ha fallado la tarea , verifica la consola", (today.getHours() + ":" + today.getMinutes()), 5000);
                console.log(error.message);

            });
}

export function shareTask(childSnap) {

    if (childSnap.getIdUsuario == getAuth().currentUser.uid) {
        set(ref(db, "Tareas/" + childSnap.getId), {
            AdjuntosTarea: childSnap.getAdjuntos,
            DescripcionTarea: childSnap.getDescripcion,
            EstadoTarea: childSnap.getEstado,
            FechaCreacionTarea: childSnap.getFechaInicio,
            HoraCreacion: childSnap.getHoraCreacion,
            FechaVencimientoTarea: childSnap.getFechaFin,
            IDPadre: childSnap.getIdPadre,
            IDTarea: childSnap.getId,
            IDUsuario: childSnap.getIdUsuario,
            NombreTarea: childSnap.getNombre,
            PrioridadTarea: childSnap.getPrioridad,
            VisibilidadTarea: true

        }).then(() => {
            generateToast("Publicación", "Se ha hecho publica correctamente.", (today.getHours() + ":" + today.getMinutes()), 3000);

        }).catch((error) => {

            generateToast("Error de Firebase", error.message, (today.getHours() + ":" + today.getMinutes()), 9999999);

        });
    } else {
        generateToast("Error de autenticación", "La tarea no es tuya !", (today.getHours() + ":" + today.getMinutes()), 3000);
    }
}

export function deleteTask(NombreTarea, IDTarea, IDUsuario) {

    if (IDUsuario == getAuth().currentUser.uid) {
        if (confirm("Seguro quieres borrar : " + NombreTarea + "?")) {

            remove(ref(db, "Tareas/" + IDTarea))
                    .then(() => {
                        generateToast("Información de Tareas", "Se ha borrado la tarea " + IDTarea, (today.getHours() + ":" + today.getMinutes()), 3000);
                    })
                    .catch((error) => {
                        generateToast("Error de Firebase", error.message, (today.getHours() + ":" + today.getMinutes()), 99999);
                    });

        }
    } else {

        generateToast("Error de verificación", "No puedes borrar lo que no es tuyo", (today.getHours() + ":" + today.getMinutes()), 5000);

    }
}

export function loadProfilePicture(fotoPerfil) {

    getDownloadURL(storageRef(storage, 'gs://tododaw.appspot.com/photoUser/' + getAuth().currentUser.uid + ".jpg"))
            .then((url) => {

                fotoPerfil.src = url;
            })
            .catch((error) => {
                console.log("Error cargando datos loadProfilePicture => " + error.message);
            }).finally(() => {

    });
}

export function uploadProfilePicture(filename, file) {


    uploadBytes(storageRef(storage, 'photoUser/' + filename), file).then((snapshot) => {
        console.log(snapshot);
        console.log("subiendo datos...");
    }).catch((error) => {
        console.log("Error subiendo el archivo  ! \n " + error.message);
    }).finally(() => {
        console.log("Cargada !");
        location.reload();
    });


}