/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


export class Usuarios {
    constructor(id, nombre, apellido, telefono, edad, empresa, cargo, bibliografia) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.edad = edad;
        this.empresa = empresa;
        this.cargo = cargo;
        this.bibliografia = bibliografia;
    }

    get getId() {
        return this.id;
    }
    get getNombre() {
        return this.nombre;
    }
    set setNombre(nombre) {
        this._nombre = nombre;
    }
    get getApellido() {
        return this.apellido;
    }
    set setApellido(apellido) {
        this._apellido = apellido;
    }
    get getTelefono() {
        return this.telefono;
    }
    set setTelefono(telefono) {
        this._telefono = telefono;
    }
    get getEdad() {
        return this.edad;
    }
    set setEdad(edad) {
        this._edad = edad;
    }
    get getEmpresa() {
        return this.empresa;
    }
    set setEmpresa(empresa) {
        this._empresa = empresa;
    }
    get getCargo() {
        return this.cargo;
    }
    set setCargo(cargo) {
        this._cargo = cargo;
    }
    get getBibliografia() {
        return this.bibliografia
    }
    set setBibliografia(bibliografia) {
        this._bibliografia = bibliografia;
    }

    get toString() {
        return this.nombre + " " + this.apellido + " " + this.telefono + " " + this.edad + " " + this.empresa + " " + this.cargo + " " + this.bibliografia;
    }

}