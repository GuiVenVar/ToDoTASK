/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
    import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, getRedirectResult, signInWithPopup, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
    import { DataSnapshot, getDatabase, ref, get, set, child, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

    var btnLogin = document.getElementById("btnLogin");
    var btnRegister = document.getElementById("btnRegister");
    var btnSendForgot = document.getElementById("btnSendForgot");
    var btnFb = document.getElementById("fbBtn");

    function logIn() {

        const auth = getAuth();
        var formEmail = document.getElementById("formEmail");
        var formPwd = document.getElementById("formPwd");
        if (formEmail.value != "" && formPwd != "") {

signInWithEmailAndPassword(auth, formEmail.value, formPwd.value)
        .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
                window.location.href = "Pages\\MainPage.html";
    })
    .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error.message);
                alert("Usuario o contraseña incorrectas ! ");
    });
    }
    else {
                alert("Usuario o contraseña vacías");
    }
    }


    function registerUser() {

                var textNombre = document.getElementById("nombreRegistro");
                var textApellidos = document.getElementById("apellidosRegistro");
                var textEdad = document.getElementById("edadRegistro");
                var textTelefono = document.getElementById("telefonoRegistro");
                var textEmpresa = document.getElementById("empresaRegistro");
                var textCargo = document.getElementById("cargoEmpresaRegistro");
                var textEmail = document.getElementById("correoRegistro");
                var textPwd = document.getElementById("passwordRegistro");
                var textRetypePwd = document.getElementById("rtPasswordRegistro");
                var isVerified = true;
                const auth = getAuth();
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
                alert("Recuerda , la contraseña no puede tener menos de 8 carácteres o más de 16 !")
                isVerified = false;
    } else {
                textPwd.style.border = "none";
                isVerified = true;
    }
    if (textRetypePwd.value == "" || textRetypePwd.value.length < 8 || textRetypePwd.value.length > 16) {
                textRetypePwd.style.border = "1px solid red";
                alert("Recuerda , la contraseña no puede tener menos de 8 carácteres o más de 16 !")
                isVerified = false;
    } else {
                textRetypePwd.style.border = "none";
                isVerified = true;
    }

    if (textPwd.value != textRetypePwd.value && isVerified) {

                textPwd.style.border = "1px solid red";
                textRetypePwd.style.border = "1px solid red";
                alert("Las contraseñas no coinciden.");
                isVerified = false;
    }

    if (isVerified) {
                createUserWithEmailAndPassword(auth, textEmail.value, textRetypePwd.value)
                .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                        // Aqui añadimos los datos del usuario como dato en BBDD
                        console.log("USERID " + user.uid);
                        set(ref(getDatabase(), 'Usuarios/' + user.uid), {
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
                                if (getAuth().currentUser) {                      
                                window.location.href = "Pages\\MainPage.html";
    } else {
                                alert("No se ha establecido un usuario");
    }
    });
    })
    .catch((error) => {
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                console.log("Fallo => " + errorMessage);
                                // ..
    });
    } else {
                                alert("Verifica los datos");
    }
    }

    function restorePassword() {

                                var textEmail = document.getElementById("correoForgot");
                                if (textEmail.value != "") {

                        const auth = getAuth();
                                sendPasswordResetEmail(auth,
                                        textEmail.value)
                                .then( () => {
                                alert("Se ha enviado un correo de recuperación !")
    })
    .catch(function (error) {
                                        alert(error + ": Ha habido un fallo en la recuperación")
    });
    } else {
                                        textEmail.style.border = "1px solid red";
                                        alert("No puede estár el campo del correo vacío");
    }
    }

    function loginFacebook() {

                                        // Sign in using a popup.
                                        var provider = new FacebookAuthProvider();
                                        const auth = getAuth();
                                        provider.addScope('user_birthday');
                                        signInWithPopup(auth, provider).then(function (result) {
                                // This gives you a Facebook Access Token.
                                var token = result.credential.accessToken;
                                        // The signed-in user info.
                                        var user = result.user;
    });
    }

    btnFb.onclick = loginFacebook;
    btnLogin.onclick = logIn;
    btnRegister.onclick = registerUser;
    btnSendForgot.onclick = restorePassword;
