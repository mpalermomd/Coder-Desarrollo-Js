/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// Configuración de Cloudinary
const CLOUD_NAME = "dv5rrlzri";
const UPLOAD_PRESET = "Partidos";

// Cargar partidos desde localStorage
let partidos = JSON.parse(localStorage.getItem("partidos")) || [];

// Al cargar la página, mostrar partidos si estamos en partidos.html
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("resultados")) {
    mostrarPartidos();
    mostrarGaleria();
  }

  // Formulario de carga
  const form = document.getElementById("formularioPartido");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const equipo1 = document.getElementById("equipo1").value;
      const escudo1 = document.getElementById("escudo1").files[0];
      const equipo2 = document.getElementById("equipo2").value;
      const escudo2 = document.getElementById("escudo2").files[0];
      const resultado = document.getElementById("resultado").value;
      const fecha = document.getElementById("fecha").value;
      const fairPlay = document.getElementById("fairPlay").value;

      const goleadoresNombres = document.getElementById("goleadoresNombres").value.split(",");
      const goleadoresFotos = document.getElementById("goleadoresFotos").files;

      const amarillasNombres = document.getElementById("amarillasNombres").value.split(",");
      const amarillasFotos = document.getElementById("amarillasFotos").files;

      const rojasNombres = document.getElementById("rojasNombres").value.split(",");
      const rojasFotos = document.getElementById("rojasFotos").files;

      const galeriaArchivos = document.getElementById("galeria").files;

      if (!equipo1 || !equipo2 || !resultado || !fecha) {
        Swal.fire("Faltan datos", "Por favor completá los campos obligatorios", "warning");
        return;
      }

      // Subir imágenes a Cloudinary
      const escudo1Url = escudo1 ? await subirACloudinary(escudo1) : "";
      const escudo2Url = escudo2 ? await subirACloudinary(escudo2) : "";

      const goleadores = await subirConNombres(goleadoresNombres, goleadoresFotos);
      const amarillas = await subirConNombres(amarillasNombres, amarillasFotos);
      const rojas = await subirConNombres(rojasNombres, rojasFotos);

      const galeria = [];
      for (let archivo of galeriaArchivos) {
        const url = await subirACloudinary(archivo);
        galeria.push({ url, tipo: archivo.type.startsWith("video") ? "video" : "imagen" });
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
        galeria
      };

      partidos.push(nuevoPartido);
      localStorage.setItem("partidos", JSON.stringify(partidos));

      Swal.fire("Éxito", "Partido guardado correctamente", "success").then(() => {
        form.reset();
      });
    });
  }
});

// Función para subir archivo a Cloudinary
async function subirACloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  return data.secure_url;
}

// Función para emparejar nombres con imágenes
async function subirConNombres(nombres, archivos) {
  const resultado = [];

  for (let i = 0; i < nombres.length; i++) {
    const nombre = nombres[i].trim();
    const foto = archivos[i] ? await subirACloudinary(archivos[i]) : "";
    resultado.push({ nombre, foto });
  }

  return resultado;
}

// Mostrar partidos
function mostrarPartidos() {
  const div = document.getElementById("resultados");
  div.innerHTML = "";

  partidos.forEach((partido, index) => {
    div.innerHTML += `
      <div class="card p-3 mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img src="${partido.escudo1Url}" class="img-jugador me-2" />
            <strong>${partido.equipo1}</strong>
            <span class="mx-2">vs</span>
            <strong>${partido.equipo2}</strong>
            <img src="${partido.escudo2Url}" class="img-jugador ms-2" />
          </div>
          <span class="text-muted">${partido.fecha}</span>
        </div>
        <p class="mt-2"><strong>Resultado:</strong> ${partido.resultado}</p>
        <p><strong>Fair Play:</strong> ${partido.fairPlay || "N/A"}</p>
        ${mostrarListaJugadores("Goleadores", partido.goleadores)}
        ${mostrarListaJugadores("Amarillas", partido.amarillas)}
        ${mostrarListaJugadores("Rojas", partido.rojas)}
        <button class="btn btn-danger mt-2" onclick="eliminarPartido(${index})">Eliminar</button>
      </div>
    `;
  });
}

// Mostrar galería
function mostrarGaleria() {
  const div = document.getElementById("galeria");
  div.innerHTML = "";

  partidos.forEach(partido => {
    if (partido.galeria && partido.galeria.length > 0) {
      partido.galeria.forEach(item => {
        if (item.tipo === "imagen") {
          div.innerHTML += `<img src="${item.url}" class="imagen-galeria" />`;
        } else {
          div.innerHTML += `<video src="${item.url}" controls class="imagen-galeria"></video>`;
        }
      });
    }
  });
}

// Mostrar jugadores con nombre y foto
function mostrarListaJugadores(titulo, lista) {
  if (!lista || lista.length === 0) return "";
  let html = `<p><strong>${titulo}:</strong></p><div class="d-flex flex-wrap">`;
  lista.forEach(jugador => {
    html += `
      <div class="d-flex align-items-center me-3 mb-2">
        <img src="${jugador.foto}" class="img-jugador" />
        <span class="ms-2">${jugador.nombre}</span>
      </div>
    `;
  });
  html += "</div>";
  return html;
}

// Eliminar partido
function eliminarPartido(index) {
  Swal.fire({
    title: "¿Eliminar partido?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {
      partidos.splice(index, 1);
      localStorage.setItem("partidos", JSON.stringify(partidos));
      mostrarPartidos();
      mostrarGaleria();
    }
  });
}

