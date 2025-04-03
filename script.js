/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// script.js

// Lista de partidos almacenados en LocalStorage
let partidos = JSON.parse(localStorage.getItem("partidos")) || [];

// Función para agregar un partido
function agregarPartido() {
    const equipo1 = document.getElementById("equipo1").value;
    const equipo2 = document.getElementById("equipo2").value;
    const resultado = document.getElementById("resultado").value;
    const goleadores = document.getElementById("goleadores").value;
    const amarillas = document.getElementById("amarillas").value;
    const rojas = document.getElementById("rojas").value;
    const fairPlay = document.getElementById("fairPlay").value;
    
    if (!equipo1 || !equipo2 || !resultado) {
        Swal.fire("Error", "Debes completar al menos los nombres de los equipos y el resultado", "error");
        return;
    }

    const nuevoPartido = { equipo1, equipo2, resultado, goleadores, amarillas, rojas, fairPlay };
    partidos.push(nuevoPartido);
    localStorage.setItem("partidos", JSON.stringify(partidos));

    Swal.fire("Éxito", "Partido agregado correctamente", "success");
    mostrarPartidos();
}

// Función para mostrar los partidos guardados
function mostrarPartidos() {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";

    partidos.forEach((partido, index) => {
        resultadosDiv.innerHTML += `
            <div class='card p-3 mt-2'>
                <h5>${partido.equipo1} vs ${partido.equipo2}</h5>
                <p><strong>Resultado:</strong> ${partido.resultado}</p>
                <p><strong>Goleadores:</strong> ${partido.goleadores || "N/A"}</p>
                <p><strong>Tarjetas Amarillas:</strong> ${partido.amarillas || "N/A"}</p>
                <p><strong>Tarjetas Rojas:</strong> ${partido.rojas || "N/A"}</p>
                <p><strong>Fair Play:</strong> ${partido.fairPlay || "N/A"}</p>
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

// Función para subir archivos multimedia a la galería
function subirArchivo() {
    const archivo = document.getElementById("archivoGaleria").files[0];
    if (!archivo) {
        Swal.fire("Error", "Debes seleccionar un archivo", "error");
        return;
    }
    
    const lector = new FileReader();
    lector.onload = function (e) {
        const galeriaDiv = document.getElementById("galeria");
        if (archivo.type.startsWith("image")) {
            galeriaDiv.innerHTML += `<img src='${e.target.result}' class='img-fluid mt-2' width='200'>`;
        } else if (archivo.type.startsWith("video")) {
            galeriaDiv.innerHTML += `<video src='${e.target.result}' controls class='mt-2' width='200'></video>`;
        }
        Swal.fire("Éxito", "Archivo subido correctamente", "success");
    };
    lector.readAsDataURL(archivo);
}

// Mostrar los partidos al cargar la página
document.addEventListener("DOMContentLoaded", mostrarPartidos);
