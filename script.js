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
      <p class="stat"><span class="highlight">Goleadores:</span> ${partido.goleadores.length > 0 ? partido.goleadores.map(g => `${g.nombre} (${g.equipo})`).join(', ') : 'Ninguno'}</p>
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
  const goleadoresInput = document.getElementById('goleadores').value.trim();
  
  const goleadores = goleadoresInput.split(',').map(g => {
    const [nombre, equipo] = g.split('-').map(s => s.trim());
    return { nombre, equipo };
  }).filter(g => g.nombre && g.equipo);
  
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

function calcularTablaPosiciones(fecha) {
  const tabla = {};
  const partidosFiltrados = partidos.filter(p => p.fecha === fecha);

  partidosFiltrados.forEach(partido => {
    const [goles1, goles2] = partido.resultado.split('-').map(Number);
    if (!tabla[partido.equipo1]) tabla[partido.equipo1] = { puntos: 0, ganados: 0 };
    if (!tabla[partido.equipo2]) tabla[partido.equipo2] = { puntos: 0, ganados: 0 };
    
    if (goles1 > goles2) {
      tabla[partido.equipo1].puntos += 3;
      tabla[partido.equipo1].ganados++;
    } else if (goles2 > goles1) {
      tabla[partido.equipo2].puntos += 3;
      tabla[partido.equipo2].ganados++;
    } else {
      tabla[partido.equipo1].puntos += 1;
      tabla[partido.equipo2].puntos += 1;
    }
  });
  
  return Object.entries(tabla).sort((a, b) => b[1].ganados - a[1].ganados);
}

function mostrarTablaPosiciones() {
  const fecha = document.getElementById('filtroFecha').value;
  if (!fecha) return;

  const tabla = calcularTablaPosiciones(fecha);
  const contenedor = document.getElementById('tablaPosiciones');
  contenedor.innerHTML = "<h3>Tabla de Posiciones</h3>";
  tabla.forEach(([equipo, stats]) => {
    const div = document.createElement('div');
    div.textContent = `${equipo}: ${stats.puntos} puntos (Ganados: ${stats.ganados})`;
    contenedor.appendChild(div);
  });
}

function filtrarPorFecha() {
  const fecha = document.getElementById('filtroFecha').value;
  const filtrados = partidos.filter(p => p.fecha === fecha);
  mostrarResultados(filtrados);
  mostrarTablaPosiciones();
}

mostrarResultados();
