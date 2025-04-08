/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */
// Datos de Cloudinary
const cloudName = "dv5rrlzri";
const uploadPreset = "Partidos";

// Lista de partidos desde LocalStorage
let partidos = JSON.parse(localStorage.getItem("partidos")) || [];

// Función para subir un archivo a Cloudinary y devolver la URL
async function subirACloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
}

// Agregar campos dinámicos para goleadores, amarillas o rojas
function agregarCampo(tipo) {
  const contenedor = document.getElementById(tipo);
  const div = document.createElement("div");
  div.classList.add("input-group", "mb-2");
  div.innerHTML = `
    <input type="text" class="form-control" placeholder="Nombre del jugador" required>
    <input type="file" class="form-control" accept="image/*" required>
  `;
  contenedor.appendChild(div);
}

// Evento al cargar el formulario
document.getElementById("formularioPartido")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("d-none");

  const equipo1 = document.getElementById("equipo1").value;
  const equipo2 = document.getElementById("equipo2").value;
  const resultado = document.getElementById("resultado").value;
  const fairPlay = document.getElementById("fairPlay").value;
  const fecha = document.getElementById("fecha").value;

  if (!equipo1 || !equipo2 || !resultado || !fecha) {
    spinner.classList.add("d-none");
    return Swal.fire("Error", "Completa todos los campos obligatorios", "error");
  }

  const escudo1 = document.getElementById("escudo1").files[0];
  const escudo2 = document.getElementById("escudo2").files[0];
  const escudo1Url = escudo1 ? await subirACloudinary(escudo1) : "";
  const escudo2Url = escudo2 ? await subirACloudinary(escudo2) : "";

  const goleadores = await obtenerJugadoresConImagen("goleadores");
  const amarillas = await obtenerJugadoresConImagen("amarillas");
  const rojas = await obtenerJugadoresConImagen("rojas");

  // Subir recuerdos (imágenes/videos)
  const galeriaArchivos = document.getElementById("galeria").files;
  const galeriaUrls = [];
  for (const archivo of galeriaArchivos) {
    const url = await subirACloudinary(archivo);
    galeriaUrls.push({ url, tipo: archivo.type.startsWith("video") ? "video" : "imagen" });
  }

  const nuevoPartido = {
    equipo1,
    equipo2,
    resultado,
    fairPlay,
    fecha,
    escudo1Url,
    escudo2Url,
    goleadores,
    amarillas,
    rojas,
    galeria: galeriaUrls
  };

  partidos.push(nuevoPartido);
  localStorage.setItem("partidos", JSON.stringify(partidos));

  spinner.classList.add("d-none");
  Swal.fire("¡Éxito!", "Partido cargado correctamente", "success");
  document.getElementById("formularioPartido").reset();
  document.getElementById("goleadores").innerHTML = "";
  document.getElementById("amarillas").innerHTML = "";
  document.getElementById("rojas").innerHTML = "";
});

// Obtener nombre e imagen de jugadores de campos dinámicos
async function obtenerJugadoresConImagen(tipo) {
  const divs = document.getElementById(tipo).querySelectorAll(".input-group");
  const jugadores = [];
  for (const div of divs) {
    const nombre = div.children[0].value;
    const imagen = div.children[1].files[0];
    if (nombre && imagen) {
      const url = await subirACloudinary(imagen);
      jugadores.push({ nombre, imagen: url });
    }
  }
  return jugadores;
}

// Mostrar partidos en partidos.html
function mostrarPartidos() {
  const resultados = document.getElementById("resultados");
  if (!resultados) return;
  resultados.innerHTML = "";

  partidos.forEach((partido, i) => {
    resultados.innerHTML += `
      <div class="card shadow-sm p-3 mb-4">
        <div class="row align-items-center">
          <div class="col-md-2 text-center">
            <img src="${partido.escudo1Url}" class="img-fluid" width="80">
            <p>${partido.equipo1}</p>
          </div>
          <div class="col-md-2 text-center">
            <strong>${partido.resultado}</strong>
            <p>${partido.fecha}</p>
          </div>
          <div class="col-md-2 text-center">
            <img src="${partido.escudo2Url}" class="img-fluid" width="80">
            <p>${partido.equipo2}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Fair Play:</strong> ${partido.fairPlay}</p>
            ${mostrarJugadores("Goleadores", partido.goleadores)}
            ${mostrarJugadores("Amarillas", partido.amarillas)}
            ${mostrarJugadores("Rojas", partido.rojas)}
            <button class="btn btn-danger mt-2" onclick="eliminarPartido(${i})">Eliminar</button>
          </div>
        </div>
      </div>
    `;
  });
}

// Mostrar galería
function mostrarGaleria() {
  const galeriaDiv = document.getElementById("galeria");
  if (!galeriaDiv) return;

  galeriaDiv.innerHTML = "";
  partidos.forEach(p => {
    p.galeria?.forEach(media => {
      if (media.tipo === "imagen") {
        galeriaDiv.innerHTML += `<img src="${media.url}" class="img-thumbnail" width="200"/>`;
      } else {
        galeriaDiv.innerHTML += `<video src="${media.url}" controls width="200" class="rounded"></video>`;
      }
    });
  });
}

// Mostrar jugadores con imagen
function mostrarJugadores(titulo, lista = []) {
  if (!lista.length) return "";
  const items = lista.map(j => `
    <div class="d-flex align-items-center mb-1">
      <img src="${j.imagen}" class="rounded-circle me-2" width="30" height="30"/>
      <span>${j.nombre}</span>
    </div>
  `).join("");
  return `<p><strong>${titulo}:</strong><br>${items}</p>`;
}

// Eliminar partido
function eliminarPartido(index) {
  partidos.splice(index, 1);
  localStorage.setItem("partidos", JSON.stringify(partidos));
  mostrarPartidos();
  mostrarGaleria();
}

// Ejecutar en la página de resultados
document.addEventListener("DOMContentLoaded", () => {
  mostrarPartidos();
  mostrarGaleria();
});

