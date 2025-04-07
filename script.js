/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// script.js

// ✅ Cargar partidos guardados desde localStorage
let partidos = JSON.parse(localStorage.getItem("partidos")) || [];

// ✅ Agrega un nuevo partido y guarda las imágenes cargadas
function agregarPartido() {
  const equipo1 = document.getElementById("equipo1").value.trim();
  const equipo2 = document.getElementById("equipo2").value.trim();
  const resultado = document.getElementById("resultado").value.trim();
  const goleadores = document.getElementById("goleadores").value.trim();
  const amarillas = document.getElementById("amarillas").value.trim();
  const rojas = document.getElementById("rojas").value.trim();
  const fairPlay = document.getElementById("fairPlay").value.trim();
  const fecha = document.getElementById("fecha").value;

  const logo1 = document.getElementById("logoEquipo1").value;
  const logo2 = document.getElementById("logoEquipo2").value;
  const fotoGoleador = document.getElementById("fotoGoleador").value;

  if (!equipo1 || !equipo2 || !resultado || !fecha) {
    Swal.fire("Error", "Completá los campos obligatorios: equipos, resultado y fecha", "error");
    return;
  }

  const partido = {
    equipo1,
    equipo2,
    resultado,
    goleadores,
    amarillas,
    rojas,
    fairPlay,
    fecha,
    logo1,
    logo2,
    fotoGoleador
  };

  partidos.push(partido);
  localStorage.setItem("partidos", JSON.stringify(partidos));

  Swal.fire("Éxito", "Partido cargado correctamente", "success");
  document.getElementById("formulario").reset();
}

// ✅ Muestra todos los partidos almacenados
function mostrarPartidos() {
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  partidos.forEach((p, index) => {
    resultadosDiv.innerHTML += `
      <div class="card mb-4 p-3 shadow-sm">
        <div class="d-flex align-items-center mb-2">
          ${p.logo1 ? `<img src="${p.logo1}" alt="Escudo ${p.equipo1}" width="60"/>` : ""}
          <h5 class="mx-2 mb-0">${p.equipo1}</h5>
          <span class="mx-2">vs</span>
          <h5 class="mb-0">${p.equipo2}</h5>
          ${p.logo2 ? `<img src="${p.logo2}" alt="Escudo ${p.equipo2}" width="60"/>` : ""}
        </div>
        <p><strong>Resultado:</strong> ${p.resultado}</p>
        <p><strong>Fecha:</strong> ${p.fecha}</p>
        <p><strong>Goleadores:</strong> ${p.goleadores || "N/A"}</p>
        ${p.fotoGoleador ? `<img src="${p.fotoGoleador}" alt="Foto Goleador" class="img-thumbnail" width="80"/>` : ""}
        <p><strong>Tarjetas Amarillas:</strong> ${p.amarillas || "N/A"}</p>
        <p><strong>Tarjetas Rojas:</strong> ${p.rojas || "N/A"}</p>
        <p><strong>Fair Play:</strong> ${p.fairPlay || "N/A"}</p>
        <button class="btn btn-danger" onclick="eliminarPartido(${index})">Eliminar</button>
      </div>`;
  });
}

// ✅ Elimina un partido de la lista
function eliminarPartido(index) {
  partidos.splice(index, 1);
  localStorage.setItem("partidos", JSON.stringify(partidos));
  mostrarPartidos();
}

// ✅ Abre el widget de Cloudinary para subir imágenes
function subirImagen(idCampo) {
  cloudinary.openUploadWidget({
    cloudName: 'dv5rrlzri',
    uploadPreset: 'Partidos',
    sources: ['local', 'url', 'camera'],
    multiple: false,
    folder: 'partidos',
    cropping: false
  }, (error, result) => {
    if (!error && result && result.event === "success") {
      document.getElementById(idCampo).value = result.info.secure_url;
      Swal.fire("Imagen subida", "La imagen se cargó correctamente", "success");
    }
  });
}

// ✅ Mostrar partidos al abrir partidos.html
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("resultados")) {
    mostrarPartidos();
  }
});
