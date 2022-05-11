/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



import { firebase, analytics, auth, db, logIn, registerUser, restorePassword, loginFacebook} from "../Connection/BBDDFunctions.js";
import { parseDate} from "../JSFunctions.js";

var btnLogin = document.getElementById("btnLogin");
var btnRegister = document.getElementById("btnRegister");
var btnSendForgot = document.getElementById("btnSendForgot");
var btnFb = document.getElementById("fbBtn");
var loginContainer = document.getElementById("containerLogin");
var registerContainer = document.getElementById("containerRegister");
var forgotContainer = document.getElementById("containerForgot");
var registerButton = document.getElementById("containerBtnRegister");
var closeBtnRegister = document.getElementById("closeBtnRegister");
var closeBtnForgot = document.getElementById("closeBtnForgot");
var btnRegistro = document.getElementById("btnRegister");
var btnForgot = document.getElementById("btnForgot");

btnFb.onclick = () => {
    loginFacebook();
};
btnLogin.onclick = () => {
    logIn(document.getElementById("formEmail").value,
            document.getElementById("formPwd").value);
};

btnRegister.onclick = () => {
    registerUser(document.getElementById("nombreRegistro"),
            document.getElementById("apellidosRegistro"),
            document.getElementById("edadRegistro"),
            document.getElementById("telefonoRegistro"),
            document.getElementById("empresaRegistro"),
            document.getElementById("cargoEmpresaRegistro"),
            document.getElementById("passwordRegistro"),
            document.getElementById("rtPasswordRegistro"));
};

btnSendForgot.onclick = () => {
    restorePassword(document.getElementById("formEmail"));
    generateToast("Firebase", "Se ha enviado un correo de confirmación !", (today.getHours() + ":" + today.getMinutes()), 2000);
};


function loadRegister() {

    loginContainer.style.pointerEvents = "none";
    registerContainer.style.display = "block";

}

function loadForgot() {

    loginContainer.style.pointerEvents = "none";
    forgotContainer.style.display = "block";

}
function loadLogin() {
    loginContainer.style.pointerEvents = "all";
    registerContainer.style.display = "none";
    forgotContainer.style.display = "none";
}


btnForgot.onclick = loadForgot;
registerButton.onclick = loadRegister;
closeBtnRegister.onclick = loadLogin;
closeBtnForgot.onclick = loadLogin;

loadLogin();