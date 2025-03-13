/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */



const partidos = JSON.parse(localStorage.getItem('partidos')) || [];

function mostrarResultados() {
function mostrarResultados(filtro = 'todos') {
  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = "";

  partidos.forEach((partido, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h2>${partido.equipo1} vs ${partido.equipo2}</h2>
      <p class="stat"><span class="highlight">Resultado:</span> ${partido.resultado}</p>
      <p class="stat"><span class="highlight">Goleadores:</span> ${partido.goleadores.length > 0 ? partido.goleadores.join(', ') : 'Ninguno'}</p>
      <p class="stat"><span class="highlight">Tarjetas Amarillas:</span> ${partido.tarjetas.amarillas}</p>
      <p class="stat"><span class="highlight">Tarjetas Rojas:</span> ${partido.tarjetas.rojas}</p>
      <p class="stat"><span class="highlight">Fair Play:</span> ${partido.fairPlay}/10</p>
      <button class="btn-eliminar" onclick="eliminarPartido(${index})">Eliminar</button>
    `;
    contenedor.appendChild(card);
    if (filtro === 'todos' || partido.equipo1 === filtro || partido.equipo2 === filtro) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('data-equipo1', partido.equipo1);
      card.setAttribute('data-equipo2', partido.equipo2);

      card.innerHTML = `
        <h2>${partido.equipo1} vs ${partido.equipo2}</h2>
        <p class="stat"><span class="highlight">Resultado:</span> ${partido.resultado}</p>
        <p class="stat"><span class="highlight">Goleadores:</span> ${partido.goleadores.length > 0 ? partido.goleadores.join(', ') : 'Ninguno'}</p>
        <p class="stat"><span class="highlight">Tarjetas Amarillas:</span> ${partido.tarjetas.amarillas}</p>
        <p class="stat"><span class="highlight">Tarjetas Rojas:</span> ${partido.tarjetas.rojas}</p>
        <p class="stat"><span class="highlight">Fair Play:</span> ${partido.fairPlay}/10</p>
        <button class="btn-eliminar" onclick="eliminarPartido(${index})">Eliminar</button>
      `;

      contenedor.appendChild(card);
    }
  });
}

function eliminarPartido(index) {
  }
}

function filtrarPartidos(categoria) {
  if (categoria === 'todos') {
    mostrarResultados();
  } else {
    mostrarResultados(categoria);
  }
}

function mostrarMensaje(mensaje) {
  const mensajeDiv = document.createElement('div');
  mensajeDiv.classList.add('mensaje-exito');
}