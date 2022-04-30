/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function multiButtonHover(element) {
    var firstchild = element.firstChild;
    firstchild.style.display = "block";
    element.style.backgroundColor = "aliceblue";
}

function removeButtonHover(element) {
    var firstchild = element.firstChild;
    firstchild.style.display = "none";
    element.style.backgroundColor = "white";

}
