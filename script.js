/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// Cloudinary config
const CLOUD_NAME = "dv5rrlzri";
const UPLOAD_PRESET = "Partidos";

// Array de partidos guardados
let partidos = JSON.parse(localStorage.getItem("partidos")) || [];

// Al cargar la página de resultados
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("resultados")) {
    mostrarPartidos();
  }
});

// Agrega un nuevo campo de goleador
function agregarGoleador() {
  const container = document.getElementById("goleadores-container");

  const div = document.createElement("div");
  div.className = "mb-2 d-flex align-items-center gap-2";
  div.innerHTML = `
    <input type="text" class="form-control goleador-nombre" placeholder="Nombre del goleador" required>
    <input type="hidden" class="goleador-foto">
    <button type="button" class="btn btn-sm btn-outline-primary" onclick="subirFotoGoleador(this)">Subir Foto</button>
    <img class="preview-img img-thumbnail d-none" />
  `;
  container.appendChild(div);
}

// Subir foto a Cloudinary y mostrarla junto al nombre
function subirFotoGoleador(btn) {
  const widget = cloudinary.createUploadWidget({
    cloudName: CLOUD_NAME,
    uploadPreset: UPLOAD_PRESET
  }, (error, result) => {
    if (!error && result && result.event === "success") {
      const container = btn.parentElement;
      container.querySelector(".goleador-foto").value = result.info.secure_url;
      const img = container.querySelector(".preview-img");
      img.src = result.info.secure_url;
      img.classList.remove("d-none");
    }
  });
  widget.open();
}

// Subir múltiples imágenes/videos al campo correspondiente
function subirMultiplesImagenes(inputId, previewId) {
  const widget = cloudinary.createUploadWidget({
    cloudName: CLOUD_NAME,
    uploadPreset: UPLOAD_PRESET,
    multiple: true
  }, (error, result) => {
    if (!error && result && result.event === "success") {
      const input = document.getElementById(inputId);
      const preview = document.getElementById(previewId);

      let urls = input.value ? JSON.parse(input.value) : [];
      urls.push(result.info.secure_url);
      input.value = JSON.stringify(urls);

      let previewEl;
      if (result.info.resource_type === "video") {
        previewEl = document.createElement("video");
        previewEl.src = result.info.secure_url;
        previewEl.controls = true;
        previewEl.width = 200;
      } else {
        previewEl = document.createElement("img");
        previewEl.src = result.info.secure_url;
        previewEl.className = "img-thumbnail";
        previewEl.width = 100;
      }
      preview.appendChild(previewEl);
    }
  });
  widget.open();
}

// Guardar partido
function agregarPartido() {
  const equipo1 = document.getElementById("equipo1").value;
  const equipo2 = document.getElementById("equipo2").value;
  const resultado = document.getElementById("resultado").value;
  const fecha = document.getElementById("fecha").value;
  const amarillas = document.getElementById("amarillas").value;
  const rojas = document.getElementById("rojas").value;
  const fairPlay = document.getElementById("fairPlay").value;
  const fotosPartido = document.getElementById("fotosPartido").value;

  if (!equipo1 || !equipo2 || !resultado || !fecha) {
    Swal.fire("Error", "Debes completar todos los campos obligatorios", "error");
    return;
  }

  const goleadoresInputs = document.querySelectorAll(".goleador-nombre");
  const goleadoresFotos = document.querySelectorAll(".goleador-foto");
  let goleadores = [];

  goleadoresInputs.forEach((input, i) => {
    const nombre = input.value;
    const foto = goleadoresFotos[i].value;
    if (nombre && foto) {
      goleadores.push({ nombre, foto });
    }
  });

  const nuevoPartido = {
    equipo1,
    equipo2,
    resultado,
    fecha,
    goleadores,
    amarillas,
    rojas,
    fairPlay,
    fotosPartido: fotosPartido ? JSON.parse(fotosPartido) : []
  };

  partidos.push(nuevoPartido);
  localStorage.setItem("partidos", JSON.stringify(partidos));
  Swal.fire("Éxito", "Partido cargado correctamente", "success");
  document.getElementById("formulario").reset();
  document.getElementById("goleadores-container").innerHTML = "";
  document.getElementById("previewPartido").innerHTML = "";
}

// Mostrar partidos
function mostrarPartidos() {
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  partidos.forEach((partido, index) => {
    let goleadoresHTML = partido.goleadores.map(g => `
      <div class="d-flex align-items-center gap-2 mb-1">
        <img src="${g.foto}" class="img-thumbnail" width="50">
        <span>${g.nombre}</span>
      </div>`).join("");

    let galeriaHTML = partido.fotosPartido.map(url => {
      if (url.includes(".mp4")) {
        return `<video src="${url}" controls width="200" class="me-2 mb-2"></video>`;
      } else {
        return `<img src="${url}" class="img-thumbnail me-2 mb-2" width="100">`;
      }
    }).join("");

    container.innerHTML += `
      <div class="card p-3 mb-4">
        <h5>${partido.equipo1} vs ${partido.equipo2}</h5>
        <p><strong>Resultado:</strong> ${partido.resultado}</p>
        <p><strong>Fecha:</strong> ${partido.fecha}</p>
        <p><strong>Goleadores:</strong></p>
        ${goleadoresHTML || "N/A"}
        <p><strong>Amarillas:</strong> ${partido.amarillas || "N/A"}</p>
        <p><strong>Rojas:</strong> ${partido.rojas || "N/A"}</p>
        <p><strong>Fair Play:</strong> ${partido.fairPlay || "N/A"}</p>
        <div class="d-flex flex-wrap">${galeriaHTML}</div>
        <button class="btn btn-danger mt-2" onclick="eliminarPartido(${index})">Eliminar</button>
      </div>
    `;
  });
}

// Eliminar partido
function eliminarPartido(index) {
  partidos.splice(index, 1);
  localStorage.setItem("partidos", JSON.stringify(partidos));
  mostrarPartidos();
}
