/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// Obtener los partidos almacenados
let partidos = JSON.parse(localStorage.getItem("partidos")) || [];

// Mostrar los partidos al cargar la página
document.addEventListener("DOMContentLoaded", mostrarPartidos);

// Función para agregar un nuevo partido
function agregarPartido() {
    const equipo1 = document.getElementById("equipo1").value.trim();
    const equipo2 = document.getElementById("equipo2").value.trim();
    const resultado = document.getElementById("resultado").value.trim();
    const goleadores = document.getElementById("goleadores").value.trim();
    const amarillas = document.getElementById("amarillas").value.trim();
    const rojas = document.getElementById("rojas").value.trim();
    const fairPlay = document.getElementById("fairPlay").value.trim();
    const fecha = document.getElementById("fecha").value;

    const fotosGoleadores = JSON.parse(document.getElementById("fotosGoleadores").value || "[]");
    const fotosPartido = JSON.parse(document.getElementById("fotosPartido").value || "[]");

    // Validación básica
    if (!equipo1 || !equipo2 || !resultado || !fecha) {
        Swal.fire("Campos incompletos", "Por favor completa todos los campos obligatorios", "warning");
        return;
    }

    const nuevoPartido = {
        equipo1, equipo2, resultado, goleadores, amarillas, rojas, fairPlay, fecha,
        fotosGoleadores, fotosPartido
    };

    partidos.push(nuevoPartido);
    localStorage.setItem("partidos", JSON.stringify(partidos));

    Swal.fire("Éxito", "Partido cargado correctamente", "success").then(() => {
        document.getElementById("formulario").reset();
        document.getElementById("previewGoleadores").innerHTML = "";
        document.getElementById("previewPartido").innerHTML = "";
        document.getElementById("fotosGoleadores").value = "";
        document.getElementById("fotosPartido").value = "";
    });
}

// Mostrar todos los partidos en partidos.html
function mostrarPartidos() {
    const resultadosDiv = document.getElementById("resultados");
    if (!resultadosDiv) return;

    resultadosDiv.innerHTML = "";

    partidos.forEach((partido, index) => {
        const card = document.createElement("div");
        card.className = "card p-3 mt-3";

        card.innerHTML = `
            <h5>${partido.equipo1} vs ${partido.equipo2}</h5>
            <p><strong>Resultado:</strong> ${partido.resultado}</p>
            <p><strong>Fecha:</strong> ${partido.fecha}</p>
            <p><strong>Goleadores:</strong> ${partido.goleadores || "N/A"}</p>
            <div class="d-flex gap-2 flex-wrap">
                ${partido.fotosGoleadores.map(url => `<img src="${url}" class="img-thumbnail" width="60">`).join("")}
            </div>
            <p><strong>Amarillas:</strong> ${partido.amarillas || "N/A"}</p>
            <p><strong>Rojas:</strong> ${partido.rojas || "N/A"}</p>
            <p><strong>Fair Play:</strong> ${partido.fairPlay || "N/A"}</p>
            <p><strong>Fotos del partido:</strong></p>
            <div class="d-flex gap-2 flex-wrap">
                ${partido.fotosPartido.map(url => `<img src="${url}" class="img-thumbnail" width="80">`).join("")}
            </div>
            <button class="btn btn-danger mt-2" onclick="eliminarPartido(${index})">Eliminar</button>
        `;
        resultadosDiv.appendChild(card);
    });
}

// Eliminar un partido por índice
function eliminarPartido(index) {
    partidos.splice(index, 1);
    localStorage.setItem("partidos", JSON.stringify(partidos));
    mostrarPartidos();
}

// Función para subir múltiples imágenes a Cloudinary
function subirMultiplesImagenes(inputId) {
    const widget = cloudinary.createUploadWidget({
        cloudName: 'dv5rrlzri',
        uploadPreset: 'Partidos',
        multiple: true,
        maxFiles: 10
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            let imagenes = JSON.parse(document.getElementById(inputId).value || "[]");
            imagenes.push(result.info.secure_url);
            document.getElementById(inputId).value = JSON.stringify(imagenes);
            mostrarPrevisualizacion(inputId, imagenes);
        }
    });

    widget.open();
}

// Mostrar miniaturas de imágenes seleccionadas
function mostrarPrevisualizacion(inputId, urls) {
    const previewId = inputId === "fotosGoleadores" ? "previewGoleadores" : "previewPartido";
    const previewContainer = document.getElementById(previewId);
    previewContainer.innerHTML = urls.map(url => `<img src="${url}" width="60" class="img-thumbnail">`).join("");
}
