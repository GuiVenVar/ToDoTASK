/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var fotoPerfilNav = document.getElementById("fotoPerfilNav");
var fotoPerfil = document.getElementById("fotoPerfil");

fotoPerfilNav.onerror = () => {
    fotoPerfilNav.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
}
fotoPerfil.onerror = () => {
    fotoPerfil.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
}