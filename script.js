/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// script.js

let partidos = JSON.parse(localStorage.getItem("partidos")) || [];

// Mostrar partidos en partidos.html
function mostrarPartidos() {
  const resultadosDiv = document.getElementById("resultados");
  const galeriaDiv = document.getElementById("galeria");

  if (!resultadosDiv) return;

  resultadosDiv.innerHTML = "";
  galeriaDiv.innerHTML = "";

  partidos.forEach((partido, index) => {
    const {
      equipo1,
      equipo2,
      resultado,
      fecha,
      escudo1,
      escudo2,
      goleadores,
      amarillas,
      rojas,
      fairPlay,
      recuerdos,
    } = partido;

    const crearJugadoresHTML = (jugadores) =>
      jugadores
        .map(
          (j) => `
          <div class="d-flex align-items-center mb-1">
            <img src="${j.foto}" class="player-img" alt="${j.nombre}" />
            <span>${j.nombre}</span>
          </div>`
        )
        .join("");

    resultadosDiv.innerHTML += `
      <div class="card mb-4 shadow-sm p-3">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center">
            <img src="${escudo1}" class="equipo-logo me-2" />
            <h5 class="mb-0">${equipo1}</h5>
          </div>
          <div class="text-center">
            <p class="mb-0 fw-bold">${resultado}</p>
            <small>${fecha}</small>
          </div>
          <div class="d-flex align-items-center">
            <h5 class="mb-0">${equipo2}</h5>
            <img src="${escudo2}" class="equipo-logo ms-2" />
          </div>
        </div>

        <p><strong>Fair Play:</strong> ${fairPlay || "N/A"}</p>

        <div class="row">
          <div class="col-md-4">
            <h6>Goleadores:</h6>
            ${goleadores.length > 0 ? crearJugadoresHTML(goleadores) : "N/A"}
          </div>
          <div class="col-md-4">
            <h6>Tarjetas Amarillas:</h6>
            ${amarillas.length > 0 ? crearJugadoresHTML(amarillas) : "N/A"}
          </div>
          <div class="col-md-4">
            <h6>Tarjetas Rojas:</h6>
            ${rojas.length > 0 ? crearJugadoresHTML(rojas) : "N/A"}
          </div>
        </div>
      </div>
    `;

    if (recuerdos && recuerdos.length > 0) {
      recuerdos.forEach((media) => {
        if (media.tipo === "image") {
          galeriaDiv.innerHTML += `<img src="${media.url}" width="200" class="img-thumbnail" alt="Foto" />`;
        } else if (media.tipo === "video") {
          galeriaDiv.innerHTML += `<video src="${media.url}" controls width="200" class="rounded"></video>`;
        }
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", mostrarPartidos);
