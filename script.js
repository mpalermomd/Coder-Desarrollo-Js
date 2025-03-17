/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// Recuperar los partidos almacenados en localStorage o iniciar con un array vacío
const partidos = JSON.parse(localStorage.getItem('partidos')) || [];

// Función para mostrar los resultados en pantalla
function mostrarResultados(filtrados = partidos) {
  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos elementos

  filtrados.forEach((partido, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h2>${partido.fecha} - ${partido.equipo1} vs ${partido.equipo2}</h2>
      <p class="stat"><span class="highlight">Resultado:</span> ${partido.resultado}</p>
      <p class="stat"><span class="highlight">Goleadores:</span> ${
        partido.goleadores.length > 0 
          ? partido.goleadores.map(g => `${g.nombre} (${g.equipo}, ${g.goles} goles)`).join(', ') 
          : 'Ninguno'
      }</p>
      <p class="stat"><span class="highlight">Tarjetas Amarillas:</span> ${partido.tarjetas.amarillas}</p>
      <p class="stat"><span class="highlight">Tarjetas Rojas:</span> ${partido.tarjetas.rojas}</p>
      <p class="stat"><span class="highlight">Fair Play:</span> ${partido.fairPlay}/10</p>
      <button class="btn-eliminar" onclick="eliminarPartido(${index})">Eliminar</button>
    `;
    contenedor.appendChild(card);
  });
}

// Función para agregar un nuevo partido
function agregarPartido() {
  const fecha = document.getElementById('fecha').value;
  const equipo1 = document.getElementById('equipo1').value.trim();
  const equipo2 = document.getElementById('equipo2').value.trim();
  const resultado = document.getElementById('resultado').value.trim();
  
  const goleadores = [];
  document.querySelectorAll('.goleador').forEach(goleadorDiv => {
    const nombre = goleadorDiv.querySelector('.nombre-goleador').value.trim();
    const equipo = goleadorDiv.querySelector('.equipo-goleador').value;
    const goles = parseInt(goleadorDiv.querySelector('.cantidad-goles').value) || 0;
    
    if (nombre && equipo && goles > 0) {
      goleadores.push({ nombre, equipo, goles });
    }
  });

  const amarillas = parseInt(document.getElementById('amarillas').value);
  const rojas = parseInt(document.getElementById('rojas').value);
  const fairPlay = parseInt(document.getElementById('fairPlay').value);

  if (!fecha || !equipo1 || !
