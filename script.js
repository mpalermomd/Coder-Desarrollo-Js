/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// Configuración de Cloudinary
const cloudName = 'dv5rrlzri';
const uploadPreset = 'Partidos';

let partidos = JSON.parse(localStorage.getItem("partidos")) || [];

// Agrega campos dinámicamente
function agregarCampo(tipo) {
    const container = document.getElementById(`${tipo}Container`);
    const div = document.createElement('div');
    div.classList.add("mb-2", "input-group");
    div.innerHTML = `
        <input type="text" class="form-control" placeholder="Nombre del jugador" />
        <input type="file" class="form-control" accept="image/*" />
    `;
    container.appendChild(div);
}

// Sube archivo a Cloudinary y devuelve la URL
async function subirACloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    return data.secure_url;
}

// Obtiene los datos de jugadores (nombre + imagen)
async function obtenerDatosJugadores(containerId) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll(".input-group");
    const jugadores = [];

    for (let div of inputs) {
        const nombre = div.querySelector("input[type='text']").value;
        const archivo = div.querySelector("input[type='file']").files[0];

        if (!nombre || !archivo) continue;

        const imagenUrl = await subirACloudinary(archivo);
        jugadores.push({ nombre, imagenUrl });
    }

    return jugadores;
}

// Cargar partido
async function agregarPartido() {
    const equipo1 = document.getElementById("equipo1").value.trim();
    const equipo2 = document.getElementById("equipo2").value.trim();
    const resultado = document.getElementById("resultado").value.trim();
    const fecha = document.getElementById("fecha").value.trim();
    const fairPlay = document.getElementById("fairPlay").value.trim();
    const escudo1File = document.getElementById("escudo1").files[0];
    const escudo2File = document.getElementById("escudo2").files[0];
    const archivosRecuerdo = document.getElementById("archivosRecuerdo").files;

    if (!equipo1 || !equipo2 || !resultado || !fecha || !escudo1File || !escudo2File) {
        Swal.fire("Error", "Completa todos los campos obligatorios", "error");
        return;
    }

    const escudo1Url = await subirACloudinary(escudo1File);
    const escudo2Url = await subirACloudinary(escudo2File);

    const goleadores = await obtenerDatosJugadores("goleadoresContainer");
    const amarillas = await obtenerDatosJugadores("amarillasContainer");
    const rojas = await obtenerDatosJugadores("rojasContainer");

    // Subir archivos de recuerdo
    const recuerdos = [];
    for (let archivo of archivosRecuerdo) {
        const url = await subirACloudinary(archivo);
        recuerdos.push({ tipo: archivo.type, url });
    }

    const nuevoPartido = {
        equipo1,
        equipo2,
        resultado,
        fecha,
        fairPlay,
        escudo1Url,
        escudo2Url,
        goleadores,
        amarillas,
        rojas,
        recuerdos
    };

    partidos.push(nuevoPartido);
    localStorage.setItem("partidos", JSON.stringify(partidos));
    Swal.fire("Éxito", "Partido cargado correctamente", "success");
}

// Mostrar partidos en partidos.html
function mostrarPartidos() {
    const contenedor = document.getElementById("resultados");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    partidos.forEach(p => {
        const card = document.createElement("div");
        card.classList.add("card", "mb-4", "p-3");

        card.innerHTML = `
            <div class="d-flex align-items-center mb-2">
                <img src="${p.escudo1Url}" alt="escudo1" class="me-2" width="50">
                <strong class="me-2">${p.equipo1}</strong> vs 
                <strong class="mx-2">${p.equipo2}</strong>
                <img src="${p.escudo2Url}" alt="escudo2" class="ms-2" width="50">
            </div>
            <p><strong>Resultado:</strong> ${p.resultado} | <strong>Fecha:</strong> ${p.fecha}</p>
            <p><strong>Fair Play:</strong> ${p.fairPlay || "N/A"}</p>

            ${mostrarJugadores("Goleadores", p.goleadores)}
            ${mostrarJugadores("Tarjetas Amarillas", p.amarillas)}
            ${mostrarJugadores("Tarjetas Rojas", p.rojas)}
        `;

        contenedor.appendChild(card);
    });

    const galeria = document.getElementById("galeria");
    if (galeria) {
        galeria.innerHTML = "";
        partidos.forEach(p => {
            p.recuerdos.forEach(r => {
                if (r.tipo.startsWith("image")) {
                    galeria.innerHTML += `<img src="${r.url}" class="img-thumbnail" />`;
                } else if (r.tipo.startsWith("video")) {
                    galeria.innerHTML += `<video src="${r.url}" controls width="200" class="rounded"></video>`;
                }
            });
        });
    }
}

// Mostrar sección de jugadores (nombre + imagen)
function mostrarJugadores(titulo, lista) {
    if (!lista || lista.length === 0) return "";
    let html = `<p><strong>${titulo}:</strong></p><div class="d-flex flex-wrap gap-2">`;
    lista.forEach(j => {
        html += `
            <div class="text-center">
                <img src="${j.imagenUrl}" width="60" class="rounded-circle mb-1">
                <div>${j.nombre}</div>
            </div>`;
    });
    html += "</div>";
    return html;
}

document.addEventListener("DOMContentLoaded", mostrarPartidos);

