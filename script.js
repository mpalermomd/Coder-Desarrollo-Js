/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */


const partidos = JSON.parse(localStorage.getItem('partidos')) || [];

function mostrarResultados(filtrados = partidos) {
  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = "";
  
  filtrados.forEach((partido, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h2>${partido.fecha} - ${partido.equipo1} vs ${partido.equipo2}</h2>
      <p class="stat"><span class="highlight">Resultado:</span> ${partido.resultado}</p>
      <p class="stat"><span class="highlight">Goleadores:</span> ${partido.goleadores.length > 0 ? partido.goleadores.join(', ') : 'Ninguno'}</p>
      <p class="stat"><span class="highlight">Tarjetas Amarillas:</span> ${partido.tarjetas.amarillas}</p>
      <p class="stat"><span class="highlight">Tarjetas Rojas:</span> ${partido.tarjetas.rojas}</p>
      <p class="stat"><span class="highlight">Fair Play:</span> ${partido.fairPlay}/10</p>
      <button class="btn-eliminar" onclick="eliminarPartido(${index})">Eliminar</button>
    `;
    contenedor.appendChild(card);
  });
}

function agregarPartido() {
  const fecha = document.getElementById('fecha').value;
  const equipo1 = document.getElementById('equipo1').value.trim();
  const equipo2 = document.getElementById('equipo2').value.trim();
  const resultado = document.getElementById('resultado').value.trim();
  const goleadores = document.getElementById('goleadores').value.split(',').map(g => g.trim()).filter(g => g);
  const amarillas = parseInt(document.getElementById('amarillas').value);
  const rojas = parseInt(document.getElementById('rojas').value);
  const fairPlay = parseInt(document.getElementById('fairPlay').value);
  
  if (!fecha || !equipo1 || !equipo2 || isNaN(amarillas) || isNaN(rojas) || isNaN(fairPlay)) {
    alert('Por favor, complete todos los campos correctamente.');
    return;
  }
  
  partidos.push({ fecha, equipo1, equipo2, resultado, goleadores, tarjetas: { amarillas, rojas }, fairPlay });
  localStorage.setItem('partidos', JSON.stringify(partidos));
  mostrarResultados();
}

function eliminarPartido(index) {
  partidos.splice(index, 1);
  localStorage.setItem('partidos', JSON.stringify(partidos));
  mostrarResultados();
}

function filtrarPorFecha() {
  const fecha = document.getElementById('filtroFecha').value;
  const filtrados = partidos.filter(p => p.fecha === fecha);
  mostrarResultados(filtrados);
}

function filtrarPorGoleador() {
  const goleador = document.getElementById('filtroGoleador').value.trim();
  const filtrados = partidos.filter(p => p.goleadores.includes(goleador));
  mostrarResultados(filtrados);
}

mostrarResultados();
