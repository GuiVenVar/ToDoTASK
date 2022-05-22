/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



export class Tareas {

    constructor(snap, id, idUsuario, idPadre, nombre, descripcion, fechaInicio, horaCreacion, fechaFin, prioridad, estado, visibilidad, adjuntos) {
        this.snap = snap;
        this.id = id;
        this.idUsuario = idUsuario;
        this.idPadre = idPadre;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.horaCreacion = horaCreacion;
        this.fechaFin = fechaFin;
        this.prioridad = prioridad;
        this.estado = estado;
        this.visibilidad = visibilidad;
        this.adjuntos = adjuntos;

    }

    get getSnap() {
        return this.snap;
    }

    get getId() {
        return this.id;
    }

    get getIdUsuario() {
        return this.idUsuario;
    }
    get getIdPadre() {
        return this.idPadre;
    }

    get getNombre() {
        return this.nombre;
    }
    set setNombre(nombre) {
        this._nombre = nombre;
    }

    get getDescripcion() {
        return this.descripcion;
    }
    set setDescripcion(descripcion) {
        this._descripcion = descripcion;
    }
    get getFechaInicio() {
        return this.fechaInicio;
    }
    get getHoraCreacion() {
        return this.horaCreacion;
    }
    set setFechaInicio(fechaInicio) {
        this._fechaInicio = fechaInicio;
    }
    get getFechaFin() {
        return this.fechaFin;
    }
    set setFechaFin(fechaFin) {
        this._fechaFin = fechaFin;
    }
    get getPrioridad() {
        return this.prioridad;
    }
    set setPrioridad(prioridad) {
        this._prioridad = prioridad;
    }
    get getEstado() {
        return this.estado;
    }
    set setEstado(estado) {
        this._estado = estado;
    }
    get getVisibilidad() {
        return this.visibilidad;
    }
    set setVisibilidad(visibilidad) {
        this._visibilidad = visibilidad;
    }
    get getAdjuntos() {
        return this.adjuntos;
    }
    set setAdjuntos(adjuntos) {
        this._adjuntos = adjuntos;
    }

    get toString() {
        return this.id + ", IdUsuario :  " + this.idUsuario + ", IdPadre : " + this.idPadre + ", Nombre :  " + this.nombre + " , Descripcion :" + this.descripcion + " , Fecha inicio: " +
                this.fechaInicio + ", Hora Creacion : " + this.horaCreacion + ", Fecha Fin :  " + this.fechaFin + ", Prioridad :" + this.prioridad + " ,Estado : " + this.estado + " ,Visibilidad : " + this.visibilidad + " ,Adjuntos :" + this.adjuntos;
    }

}