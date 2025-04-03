/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// Lista de partidos almacenados en LocalStorage
let partidos = JSON.parse(localStorage.getItem("partidos")) || [];

// Función para agregar un partido
function agregarPartido() {
    const fechaPartido = document.getElementById("fechaPartido").value;
    const equipo1 = document.getElementById("equipo1").value;
    const equipo2 = document.getElementById("equipo2").value;
    const resultado = document.getElementById("resultado").value;
    const goleadores = document.getElementById("goleadores").value;
    const amarillas = document.getElementById("amarillas").value;
    const rojas = document.getElementById("rojas").value;

    if (!fechaPartido || !equipo1 || !equipo2 || !resultado) {
        Swal.fire("Error", "Completa los campos obligatorios", "error");
        return;
    }

    const partido = { fechaPartido, equipo1, equipo2, resultado, goleadores, amarillas, rojas };

    // Cargar imágenes de equipos
    partido.logoEquipo1 = cargarImagen("logoEquipo1");
    partido.logoEquipo2 = cargarImagen("logoEquipo2");

    // Cargar imágenes de jugadores
    partido.fotosGoleadores = cargarImagenesMultiples("fotosGoleadores");
    partido.fotosAmarillas = cargarImagenesMultiples("fotosAmarillas");
    partido.fotosRojas = cargarImagenesMultiples("fotosRojas");

    partidos.push(partido);
    localStorage.setItem("partidos", JSON.stringify(partidos));

    Swal.fire("Éxito", "Partido agregado correctamente", "success");
}

// Función para cargar una imagen
function cargarImagen(inputId) {
    const archivo = document.getElementById(inputId).files[0];
    if (archivo) {
        const lector = new FileReader();
        lector.readAsDataURL(archivo);
        return lector.result;
    }
    return null;
}

// Función para cargar múltiples imágenes
function cargarImagenesMultiples(inputId) {
    const archivos = document.getElementById(inputId).files;
    let imagenes = [];
    for (let archivo of archivos) {
        const lector = new FileReader();
        lector.readAsDataURL(archivo);
        imagenes.push(lector.result);
    }
    return imagenes;
}

// Función para mostrar los partidos
function mostrarPartidos() {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";

    partidos.forEach((partido, index) => {
        resultadosDiv.innerHTML += `
            <div class='card p-3 mt-2'>
                <h5>${partido.fechaPartido}: ${partido.equipo1} vs ${partido.equipo2}</h5>
                <p><strong>Resultado:</strong> ${partido.resultado}</p>
                <p><strong>Goleadores:</strong> ${partido.goleadores || "N/A"}</p>
                <p><strong>Tarjetas Amarillas:</strong> ${partido.amarillas || "N/A"}</p>
                <p><strong>Tarjetas Rojas:</strong> ${partido.rojas || "N/A"}</p>
                <button class='btn btn-danger' onclick='eliminarPartido(${index})'>Eliminar</button>
            </div>`;
    });
}

// Función para eliminar un partido
function eliminarPartido(index) {
    partidos.splice(index, 1);
    localStorage.setItem("partidos", JSON.stringify(partidos));
    mostrarPartidos();
}

document.addEventListener("DOMContentLoaded", mostrarPartidos);
