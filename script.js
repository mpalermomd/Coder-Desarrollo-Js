/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

document.addEventListener("DOMContentLoaded", function () {
    mostrarPartidos(); // Muestra los partidos guardados al cargar la página
    mostrarGaleria();  // Muestra la galería de imágenes y videos guardados
});

// Función para agregar un nuevo partido al almacenamiento local
function agregarPartido() {
    let equipo1 = document.getElementById("equipo1").value;
    let equipo2 = document.getElementById("equipo2").value;
    let resultado = document.getElementById("resultado").value;
    let goleadores = document.getElementById("goleadores").value;
    let amarillas = document.getElementById("amarillas").value;
    let rojas = document.getElementById("rojas").value;
    let fairPlay = document.getElementById("fairPlay").value;

    let partidos = JSON.parse(localStorage.getItem("partidos")) || []; // Recupera partidos guardados o inicializa un array vacío
    let nuevoPartido = { equipo1, equipo2, resultado, goleadores, amarillas, rojas, fairPlay };
    partidos.push(nuevoPartido);
    localStorage.setItem("partidos", JSON.stringify(partidos)); // Guarda el nuevo partido en localStorage

    Swal.fire({
        title: "¡Éxito!",
        text: "El partido se ha agregado correctamente.",
        icon: "success"
    });

    mostrarPartidos(); // Actualiza la lista de partidos en pantalla
}

// Función para mostrar los partidos guardados en localStorage
function mostrarPartidos() {
    let partidos = JSON.parse(localStorage.getItem("partidos")) || [];
    let resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";
    
    partidos.forEach((p, index) => {
        resultadosDiv.innerHTML += `
            <div class='card p-3 mb-2'>
                <h5>${p.equipo1} vs ${p.equipo2}</h5>
                <p>Resultado: ${p.resultado}</p>
                <p>Goleadores: ${p.goleadores}</p>
                <p>Tarjetas Amarillas: ${p.amarillas}, Rojas: ${p.rojas}</p>
                <p>Fair Play: ${p.fairPlay}</p>
                <button class='btn btn-danger' onclick='eliminarPartido(${index})'>Eliminar</button>
            </div>
        `;
    });
}

// Función para eliminar un partido de la lista
function eliminarPartido(index) {
    let partidos = JSON.parse(localStorage.getItem("partidos")) || [];
    partidos.splice(index, 1);
    localStorage.setItem("partidos", JSON.stringify(partidos));
    mostrarPartidos();
    Swal.fire("Eliminado", "El partido ha sido eliminado.", "warning");
}

// Función para subir archivos a la galería (imágenes y videos)
function subirArchivo() {
    let archivoInput = document.getElementById("archivoGaleria");
    let archivo = archivoInput.files[0];
    let galeria = JSON.parse(localStorage.getItem("galeria")) || [];
    
    if (archivo) {
        let reader = new FileReader();
        reader.onload = function (e) {
            galeria.push(e.target.result);
            localStorage.setItem("galeria", JSON.stringify(galeria));
            mostrarGaleria();
            Swal.fire("Subido", "El archivo ha sido agregado a la galería.", "success");
        };
        reader.readAsDataURL(archivo);
    }
}

// Función para mostrar la galería de imágenes y videos
function mostrarGaleria() {
    let galeria = JSON.parse(localStorage.getItem("galeria")) || [];
    let galeriaDiv = document.getElementById("galeria");
    galeriaDiv.innerHTML = "";
    
    galeria.forEach((archivo, index) => {
        let elemento = archivo.includes("video") 
            ? `<video src="${archivo}" controls></video>` 
            : `<img src="${archivo}" alt="Imagen subida">`;
        galeriaDiv.innerHTML += `<div class='m-2'>${elemento}</div>`;
    });
}

// Función para redirigir a la página de resultados
function irAPaginaResultados() {
    window.location.href = "resultados.html";
}

// Carga inicial de los datos almacenados
mostrarPartidos();
mostrarGaleria();
