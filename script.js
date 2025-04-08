/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// script.js

// Cargar la lista de partidos desde el LocalStorage o iniciar vacía
let partidos = JSON.parse(localStorage.getItem("partidos")) || [];

// Función para agregar campos dinámicos (nombre + imagen) para jugadores
function agregarCampoJugador(tipo) {
    const contenedor = document.getElementById(`${tipo}Container`);
    const div = document.createElement("div");
    div.classList.add("input-group", "mb-2");

    div.innerHTML = `
        <input type="text" class="form-control" name="${tipo}Nombre" placeholder="Nombre del jugador">
        <input type="file" class="form-control" name="${tipo}Foto" accept="image/*">
    `;
    contenedor.appendChild(div);
}

// Función principal para agregar un nuevo partido
function agregarPartido() {
    // Obtener valores del formulario
    const equipo1 = document.getElementById("equipo1").value;
    const equipo2 = document.getElementById("equipo2").value;
    const escudo1 = document.getElementById("escudo1").files[0];
    const escudo2 = document.getElementById("escudo2").files[0];
    const resultado = document.getElementById("resultado").value;
    const fecha = document.getElementById("fecha").value;
    const fairPlay = document.getElementById("fairPlay").value;

    // Validación básica
    if (!equipo1 || !equipo2 || !resultado || !fecha || !escudo1 || !escudo2) {
        Swal.fire("Error", "Debes completar todos los campos requeridos", "error");
        return;
    }

    // Cargar imágenes a Cloudinary y continuar cuando estén listas
    Promise.all([
        subirACloudinary(escudo1),
        subirACloudinary(escudo2),
        procesarJugadores("goleador"),
        procesarJugadores("amarilla"),
        procesarJugadores("roja"),
        subirRecuerdos()
    ]).then(([escudo1Url, escudo2Url, goleadores, amarillas, rojas, recuerdos]) => {
        const nuevoPartido = {
            equipo1,
            equipo2,
            escudo1: escudo1Url,
            escudo2: escudo2Url,
            resultado,
            fecha,
            fairPlay,
            goleadores,
            amarillas,
            rojas,
            recuerdos
        };

        partidos.push(nuevoPartido);
        localStorage.setItem("partidos", JSON.stringify(partidos));
        Swal.fire("Éxito", "Partido cargado correctamente", "success");
        document.getElementById("formulario").reset();
        limpiarCampos();
    });
}

// Subir un archivo a Cloudinary
async function subirACloudinary(archivo) {
    const url = "https://api.cloudinary.com/v1_1/dv5rrlzri/upload";
    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("upload_preset", "Partidos");

    const response = await fetch(url, { method: "POST", body: formData });
    const data = await response.json();
    return data.secure_url;
}

// Procesar los jugadores con nombre + imagen
async function procesarJugadores(tipo) {
    const nombres = document.getElementsByName(`${tipo}Nombre`);
    const fotos = document.getElementsByName(`${tipo}Foto`);
    const jugadores = [];

    for (let i = 0; i < nombres.length; i++) {
        const nombre = nombres[i].value;
        const foto = fotos[i].files[0];
        if (!nombre || !foto) continue;

        const fotoUrl = await subirACloudinary(foto);
        jugadores.push({ nombre, foto: fotoUrl });
    }

    return jugadores;
}

// Subir los archivos de recuerdo (fotos/videos del partido)
async function subirRecuerdos() {
    const archivos = document.getElementById("recuerdos").files;
    const urls = [];

    for (const archivo of archivos) {
        const url = await subirACloudinary(archivo);
        urls.push(url);
    }

    return urls;
}

// Limpiar campos dinámicos después de cargar un partido
function limpiarCampos() {
    ["goleador", "amarilla", "roja"].forEach(tipo => {
        document.getElementById(`${tipo}Container`).innerHTML = "";
    });
}

