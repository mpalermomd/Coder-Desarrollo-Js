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

    const logoEquipo1 = document.getElementById("logoEquipo1").files[0];
    const logoEquipo2 = document.getElementById("logoEquipo2").files[0];
    const imgGoleadores = document.getElementById("imgGoleadores").files[0];
    const imgAmarillas = document.getElementById("imgAmarillas").files[0];
    const imgRojas = document.getElementById("imgRojas").files[0];

    if (!equipo1 || !equipo2 || !resultado) {
        Swal.fire("Error", "Debes completar al menos los nombres de los equipos y el resultado", "error");
        return;
    }

    const reader1 = new FileReader();
    const reader2 = new FileReader();
    const readerGol = new FileReader();
    const readerAma = new FileReader();
    const readerRoj = new FileReader();

    let imgLogos = {}, imgJugadores = {};

    reader1.onload = function (e1) {
        imgLogos.logoEquipo1 = e1.target.result;
        if (logoEquipo2) {
            reader2.readAsDataURL(logoEquipo2);
        } else {
            reader2.onload();
        }
    };

    reader2.onload = function (e2) {
        imgLogos.logoEquipo2 = e2.target?.result || "";
        if (imgGoleadores) {
            readerGol.readAsDataURL(imgGoleadores);
        } else {
            readerGol.onload();
        }
    };

    readerGol.onload = function (eGol) {
        imgJugadores.goleadores = eGol.target?.result || "";
        if (imgAmarillas) {
            readerAma.readAsDataURL(imgAmarillas);
        } else {
            readerAma.onload();
        }
    };

    readerAma.onload = function (eAma) {
        imgJugadores.amarillas = eAma.target?.result || "";
        if (imgRojas) {
            readerRoj.readAsDataURL(imgRojas);
        } else {
            readerRoj.onload();
        }
    };

    readerRoj.onload = function (eRoj) {
        imgJugadores.rojas = eRoj.target?.result || "";

        const nuevoPartido = {
            equipo1,
            equipo2,
            resultado,
            goleadores,
            amarillas,
            rojas,
            fairPlay,
            ...imgLogos,
            imgJugadores
        };

        partidos.push(nuevoPartido);
        localStorage.setItem("partidos", JSON.stringify(partidos));

        Swal.fire("Éxito", "Partido agregado correctamente", "success");
        mostrarPartidos();
    };

    if (logoEquipo1) {
        reader1.readAsDataURL(logoEquipo1);
    } else {
        reader1.onload();
    }
}

// Función para mostrar los partidos guardados
function mostrarPartidos() {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";

    partidos.forEach((partido, index) => {
        resultadosDiv.innerHTML += `
            <div class='card p-3 mt-2'>
                <div class='d-flex align-items-center justify-content-between'>
                    <div>
                        <img src='${partido.logoEquipo1 || ""}' width='50'>
                        <strong>${partido.equipo1}</strong>
                    </div>
                    <span>vs</span>
                    <div>
                        <img src='${partido.logoEquipo2 || ""}' width='50'>
                        <strong>${partido.equipo2}</strong>
                    </div>
                </div>
                <p><strong>Resultado:</strong> ${partido.resultado}</p>
                <p><strong>Goleadores:</strong> ${partido.goleadores || "N/A"}</p>
                ${partido.imgJugadores?.goleadores ? `<img src='${partido.imgJugadores.goleadores}' width='100'>` : ""}
                <p><strong>Tarjetas Amarillas:</strong> ${partido.amarillas || "N/A"}</p>
                ${partido.imgJugadores?.amarillas ? `<img src='${partido.imgJugadores.amarillas}' width='100'>` : ""}
                <p><strong>Tarjetas Rojas:</strong> ${partido.rojas || "N/A"}</p>
                ${partido.imgJugadores?.rojas ? `<img src='${partido.imgJugadores.rojas}' width='100'>` : ""}
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
