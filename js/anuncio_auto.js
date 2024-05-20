import Anuncio from "./anuncio.js";

export default class Anuncio_Auto extends Anuncio {
    constructor(id, titulo, transaccion, descripcion, precio, puertas, kilometraje, potencia) {
        super(id, titulo, transaccion, descripcion, precio);
        this.puertas = puertas;
        this.kilometraje = kilometraje;
        this.potencia = potencia;
    }

}