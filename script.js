/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// script.js

// Obtener los datos guardados previamente en localStorage
let partidos = JSON.parse(localStorage.getItem("partidos")) || [];

// Mostrar partidos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarPartidos();
});

// Función para mostrar un spinner de carga
function mostrarSpinner() {
    const spinner = document.getElementById("spinnerCarga");
    spinner.classList.remove("d-none");
}

// Función para ocultar el spinner
function ocultarSpinner() {
    const spinner = document.getElementById("spinnerCarga");
    spinner.classList.add("d-none");
}

// Función para agregar un partido
function cargarPartido() {
    mostrarSpinner(); // Mostrar spinner mientras se procesa

    setTimeout(() => {
        const equipo1 = document.getElementById("equipo1").value;
        const escudo1 = document.getElementById("escudo1").value;
        const equipo2 = document.getElementById("equipo2").value;
        const escudo2 = document.getElementById("escudo2").value;
        const resultado = document.getElementById("resultado").value;
        const fecha = document.getElementById("fecha").value;

        const goleadores = obtenerDatosJugadores("goleadores");
        const amarillas = obtenerDatosJugadores("amarillas");
        const rojas = obtenerDatosJugadores("rojas");

        const multimedia = JSON.parse(localStorage.getItem("recuerdos") || "[]");

        if (!equipo1 || !equipo2 || !resultado || !fecha) {
            ocultarSpinner();
            Swal.fire("Campos incompletos", "Por favor, completá los campos obligatorios", "error");
            return;
        }

        const nuevoPartido = {
            equipo1, escudo1, equipo2, escudo2,
            resultado, fecha,
            goleadores, amarillas, rojas,
            multimedia
        };

        partidos.push(nuevoPartido);
        localStorage.setItem("partidos", JSON.stringify(partidos));

        Swal.fire("¡Partido cargado!", "Los datos se guardaron correctamente.", "success");
        limpiarFormulario();
        mostrarPartidos();
        ocultarSpinner();
    }, 1000); // Simulamos una pequeña carga
}

// Obtener datos de los jugadores desde los campos dinámicos
function obtenerDatosJugadores(tipo) {
    const seccion = document.getElementById(`${tipo}Container`);
    const jugadores = [];

    seccion.querySelectorAll(".input-group").forEach(grupo => {
        const nombre = grupo.querySelector(".nombre").value;
        const imagen = grupo.querySelector(".imagen").value;
        if (nombre && imagen) {
            jugadores.push({ nombre, imagen });
        }
    });

    return jugadores;
}

// Mostrar todos los partidos
function mostrarPartidos() {
    const contenedor = document.getElementById("listaPartidos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    partidos.forEach((partido, index) => {
        let goleadoresHTML = partido.goleadores.map(j =>
            `<div><strong>${j.nombre}</strong><br><img src="${j.imagen}" class="img-thumbnail" width="80"></div>`).join("");

        let amarillasHTML = partido.amarillas.map(j =>
            `<div><strong>${j.nombre}</strong><br><img src="${j.imagen}" class="img-thumbnail" width="80"></div>`).join("");

        let rojasHTML = partido.rojas.map(j =>
            `<div><strong>${j.nombre}</strong><br><img src="${j.imagen}" class="img-thumbnail" width="80"></div>`).join("");

        let multimediaHTML = (partido.multimedia || []).map(m =>
            m.type.startsWith("image") ?
                `<img src="${m.url}" class="img-fluid rounded mt-2" width="200">` :
                `<video src="${m.url}" controls class="mt-2" width="200"></video>`).join("");

        contenedor.innerHTML += `
            <div class="card shadow p-3 mb-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="text-center">
                        <img src="${partido.escudo1}" class="rounded mb-2" width="60"><br>
                        <strong>${partido.equipo1}</strong>
                    </div>
                    <h4>${partido.resultado}</h4>
                    <div class="text-center">
                        <img src="${partido.escudo2}" class="rounded mb-2" width="60"><br>
                        <strong>${partido.equipo2}</strong>
                    </div>
                </div>
                <p class="mt-2 text-muted"><strong>Fecha:</strong> ${partido.fecha}</p>
                <div><strong>Goleadores:</strong><div class="d-flex flex-wrap gap-2">${goleadoresHTML}</div></div>
                <div><strong>Amarillas:</strong><div class="d-flex flex-wrap gap-2">${amarillasHTML}</div></div>
                <div><strong>Rojas:</strong><div class="d-flex flex-wrap gap-2">${rojasHTML}</div></div>
                <div><strong>Recuerdos:</strong><div class="d-flex flex-wrap gap-2">${multimediaHTML}</div></div>
                <button class="btn btn-danger mt-3" onclick="eliminarPartido(${index})">Eliminar</button>
            </div>
        `;
    });
}

// Eliminar un partido por su índice
function eliminarPartido(index) {
    partidos.splice(index, 1);
    localStorage.setItem("partidos", JSON.stringify(partidos));
    mostrarPartidos();
}

// Agregar campos dinámicos para jugadores (goleadores, amarillas, rojas)
function agregarJugador(tipo) {
    const contenedor = document.getElementById(`${tipo}Container`);
    const div = document.createElement("div");
    div.classList.add("input-group", "mb-2");
    div.innerHTML = `
        <input type="text" class="form-control nombre" placeholder="Nombre del jugador">
        <input type="text" class="form-control imagen" placeholder="URL de la imagen">
        <button class="btn btn-outline-danger" onclick="this.parentElement.remove()">X</button>
    `;
    contenedor.appendChild(div);
}

// Subir archivo multimedia (foto o video) para el recuerdo
function subirArchivoGaleria() {
    const archivo = document.getElementById("archivoGaleria").files[0];
    if (!archivo) {
        Swal.fire("Error", "Seleccioná un archivo para subir", "error");
        return;
    }

    const lector = new FileReader();
    lector.onload = function (e) {
        const tipo = archivo.type;
        const multimedia = JSON.parse(localStorage.getItem("recuerdos") || "[]");
        multimedia.push({ url: e.target.result, type: tipo });
        localStorage.setItem("recuerdos", JSON.stringify(multimedia));

        Swal.fire("¡Listo!", "Archivo de recuerdo agregado correctamente", "success");
    };
    lector.readAsDataURL(archivo);
}

// Limpiar campos del formulario después de cargar un partido
function limpiarFormulario() {
    document.getElementById("formularioPartido").reset();
    ["goleadoresContainer", "amarillasContainer", "rojasContainer"].forEach(id => {
        document.getElementById(id).innerHTML = "";
    });
    localStorage.removeItem("recuerdos");
}

