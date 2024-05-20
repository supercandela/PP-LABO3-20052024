import Anuncio_Auto from "./anuncio_auto.js";

// ------>  Variables

//Nombre clave del local storage
const dataLocalStorage = "lista";

//Array de objetos a usar
let listado = getData() || [];

//Campos del form
let elementId = document.getElementById("element-id");
let titulo = document.getElementById("titulo");
let tipoTransaccion = document.getElementById("transaccion");
let descripcion = document.getElementById("descripcion");
let precio = document.getElementById("precio");
let puertas = document.getElementById("puertas");
let kilometraje = document.getElementById("km");
let potencia = document.getElementById("potencia");

// const frm = document.forms[0];

// Botones
const btnSubmit = document.getElementById("btnSubmit");
const btnEliminar = document.getElementById("btnEliminar");
// const btnCancelar = document.getElementById("btnCancelar");

//Divs
const spinnerContenedor = document.getElementById("spinnerContenedor");
const tablaContenedor = document.getElementById("tabla");

// ------>  Event Listeners

window.addEventListener("DOMContentLoaded", () => {
  displayTabla();
  document.addEventListener("click", onClick);
  btnEliminar.addEventListener("click", onEliminarElemento);
  btnCancelar.addEventListener("click", onCancelar);
});

// Evento click
btnSubmit.addEventListener("click", guardarElemento);

// Evento enter
btnSubmit.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    guardarElemento(e);
  }
});

// ------>  Funciones

//Manipulación Local Storage
function getData() {
  return JSON.parse(localStorage.getItem("lista"));
}

function postLocalStorage(clave, info) {
  localStorage.setItem(clave, JSON.stringify(info));
}

//Manipulación Tabla

function borrarTabla() {
  let tabla = tablaContenedor.firstChild;
  tablaContenedor.removeChild(tabla);
}

function displayTabla() {
  if (tablaContenedor.hasChildNodes()) {
    borrarTabla();
  }
  const tabla = crearTabla(listado);
  tablaContenedor.appendChild(tabla);
}

function crearTabla(lista) {
  //Crear tabla
  const tabla = document.createElement("table");
  tabla.classList.add("responsiveTable");
  //Crear headers
  tabla.appendChild(tablaCrearHeaders(lista[0]));
  //Crear body
  tabla.appendChild(tablaCrearBody(lista));
  return tabla;
}

function tablaCrearHeaders(lista) {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  for (const key in lista) {
    if (key != "id") {
      const th = document.createElement("th");
      th.textContent = key;
      tr.appendChild(th);
    }
  }
  thead.appendChild(tr);
  return thead;
}

function tablaCrearBody(lista) {
  const tbody = document.createElement("tbody");
  lista.forEach((element) => {
    const tr = document.createElement("tr");
    for (const key in element) {
      if (key === "id") {
        tr.setAttribute("data-id", element[key]);
      } else {
        const td = document.createElement("td");
        td.setAttribute("data-label", key);
        td.textContent = element[key];
        tr.appendChild(td);
      }
    }
    tbody.appendChild(tr);
  });
  return tbody;
}

//Manipulación Spinner
function mostrarSpinner() {
  spinnerContenedor.classList.add("spinner");
}

function ocultarSpinner() {
  spinnerContenedor.classList.remove("spinner");
}

//Manipulación Formulario
function vaciarFormulario() {
  elementId.value = "";
  titulo.value = "";
  document.querySelector(
    'input[name="transaccion"][value="venta"]'
  ).checked = true;
  descripcion.value = "";
  precio.value = "";
  puertas.value = "";
  kilometraje.value = "";
  potencia.value = "";
}

function cargarFormulario(objeto) {
  elementId.value = objeto.id;
  titulo.value = objeto.titulo;
  if (objeto.transaccion == "venta") {
    document.querySelector(
      'input[name="transaccion"][value="venta"]'
    ).checked = true;
  } else {
    document.querySelector(
      'input[name="transaccion"][value="alquiler"]'
    ).checked = true;
  }
  descripcion.value = objeto.descripcion;
  precio.value = objeto.precio;
  puertas.value = objeto.puertas;
  kilometraje.value = objeto.kilometraje;
  potencia.value = objeto.potencia;
}

function cambiarBotones(target) {
  if (target.matches("td")) {
    btnSubmit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Editar';
    if (btnSubmit.classList.contains("btn-success")) {
      btnSubmit.classList.remove("btn-success");
      btnSubmit.classList.add("btn-warning");
    }
    if (btnEliminar.classList.contains("btnEliminarHide")) {
      btnEliminar.classList.remove("btnEliminarHide");
    }
    btnEliminar.classList.add("btnEliminarShow");
  } else {
    btnSubmit.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Guardar';
    if (btnSubmit.classList.contains("btn-warning")) {
      btnSubmit.classList.remove("btn-warning");
      btnSubmit.classList.add("btn-success");
    }
    if (btnEliminar.classList.contains("btnEliminarShow")) {
      btnEliminar.classList.remove("btnEliminarShow");
    }
    btnEliminar.classList.add("btnEliminarHide");
  }
}

function onClick(e) {
  console.log(e.target);
  if (e.target.matches("td")) {
    let id = e.target.parentNode.dataset.id;
    const elemento = listado.filter((p) => p.id === parseInt(id))[0];
    cargarFormulario(elemento);
    cambiarBotones(e.target);
    document
      .querySelector("section.institucional")
      .scrollIntoView(false, { behavior: "smooth" });
  } else if (
    !e.target.matches("input") &&
    !e.target.matches("textarea") &&
    !e.target.matches("label")
  ) {
    cambiarBotones(e.target);
    vaciarFormulario();
  }
}

function onCancelar() {
  vaciarFormulario();
  cambiarBotones();
}

// Manipulación Elementos

function guardarElemento(e) {
  e.preventDefault();

  // console.log(elementId.value);
  // console.log(titulo.value);
  // console.log(tipoTransaccion.value);
  // console.log(descripcion.value);
  // console.log(precio.value);
  // console.log(puertas.value);
  // console.log(kilometraje.value);
  // console.log(potencia.value);

  if (
    titulo.value.trim() != "" &&
    descripcion.value.trim() != "" &&
    precio.value.trim() != "" &&
    puertas.value.trim() != "" &&
    kilometraje.value.trim() != "" &&
    potencia.value.trim() != ""
  ) {
    borrarTabla();
    if (parseInt(elementId.value) > 0) {
      editarElemento();
    } else {
      agregarElementoNuevo();
    }
    postLocalStorage(dataLocalStorage, listado);
    mostrarSpinner();
    setTimeout(() => {
      displayTabla(listado);
      vaciarFormulario();
      ocultarSpinner();
    }, 3000);
  }
}

function agregarElementoNuevo() {
  console.log("Agregar elemento nuevo");
  let newId = Date.now();
  let transTipo = document.querySelector(
    'input[name="transaccion"]:checked'
  ).value;
  let element = new Anuncio_Auto(
    newId,
    titulo.value,
    transTipo,
    descripcion.value,
    precio.value,
    puertas.value,
    kilometraje.value,
    potencia.value
  );
  listado.push(element);
}

function editarElemento() {
  console.log("Editar elemento");
  let id = parseInt(elementId.value);
  //VER MODAL
  if (confirm("Confirma la modificación")) {
    if (id) {
      for (let i = 0; i < listado.length; i++) {
        if (listado[i].id == id) {
          listado[i].titulo = titulo.value;
          let transTipo = document.querySelector(
            'input[name="transaccion"]:checked'
          ).value;
          listado[i].transaccion = transTipo;
          listado[i].descripcion = descripcion.value;
          listado[i].precio = precio.value;
          listado[i].puertas = puertas.value;
          listado[i].kilometraje = kilometraje.value;
          listado[i].potencia = potencia.value;
          break;
        }
      }
    }
  }
}

function onEliminarElemento(e) {
  let id = parseInt(elementId.value);
  //VER MODAL
  if (confirm("Confirma la Eliminacion")) {
    borrarTabla();
    mostrarSpinner();
    setTimeout(() => {
      if (id) {
        for (let i = 0; i < listado.length; i++) {
          if (listado[i].id == id) {
            listado.splice(i, 1);
            break;
          }
        }
        postLocalStorage(dataLocalStorage, listado);
        displayTabla(listado);
        vaciarFormulario();
        ocultarSpinner();
      }
    }, 3000);
  }
}

