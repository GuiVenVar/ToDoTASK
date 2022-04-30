/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


        var loginContainer = document.getElementById("containerLogin");
        var registerContainer = document.getElementById("containerRegister");
        var forgotContainer = document.getElementById("containerForgot");
        var registerButton = document.getElementById("containerBtnRegister");
        var closeBtnRegister = document.getElementById("closeBtnRegister");
        var closeBtnForgot = document.getElementById("closeBtnForgot");
        var btnRegistro = document.getElementById("btnRegister");
        var btnForgot = document.getElementById("btnForgot");



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
