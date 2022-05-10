/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


const fotoPerfil = document.getElementById("fotoPerfilNav");

const btnVisibility = document.getElementById("visibility");
const divBtnVisibility = document.getElementById("divVisibility");
const fechaHoy = document.getElementById("fechaHoy");
const fechaFinalizacion = document.getElementById("fechaFinalizacion");
const idTarea = document.getElementById("idTarea");


fotoPerfil.onerror = () => {
    fotoPerfil.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
    console.log("ha fallado")
}

divBtnVisibility.onclick = () => {

    if (btnVisibility.value == 0) {
        btnVisibility.value = 1;
    } else {
        btnVisibility.value = 0;
    }

};

