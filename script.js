const partidos = JSON.parse(localStorage.getItem('partidos')) || [];

function mostrarResultados(filtros = {}) {
  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = "";

  partidos.forEach((partido, index) => {
    let mostrar = true;

    // Aplicar filtros
    if (filtros.goleador && !partido.goleadores.includes(filtros.goleador)) {
      mostrar = false;
    }
    if (filtros.resultado && partido.resultado !== filtros.resultado) {
      mostrar = false;
    }
    if (filtros.amarillas && !partido.amarillas.includes(filtros.amarillas)) {
      mostrar = false;
    }
    if (filtros.rojas && !partido.rojas.includes(filtros.rojas)) {
      mostrar = false;
    }

    if (mostrar) {
      const card = document.createElement('div');
      card.classList.add('card');

      // Determinar equipo ganador
      const [goles1, goles2] = partido.resultado.split('-').map(num => parseInt(num.trim()));
      let equipoGanador = null;
      if (goles1 > goles2) equipoGanador = partido.equipo1;
      else if (goles2 > goles1) equipoGanador = partido.equipo2;

      if (equipoGanador) {
        if (equipoGanador === partido.equipo1) {
          card.classList.add('ganador');
        }
      }

      card.innerHTML = `
        <h2>${partido.equipo1} vs ${partido.equipo2}</h2>
        <p><strong>Resultado:</strong> ${partido.resultado}</p>
        <p><strong>Goleadores:</strong> ${partido.goleadores.join(', ') || 'Ninguno'}</p>
        <p><strong>Amarillas:</strong> ${partido.amarillas.join(', ') || 'Ninguno'}</p>
        <p><strong>Rojas:</strong> ${partido.rojas.join(', ') || 'Ninguno'}</p>
        <button onclick="editarPartido(${index})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarPartido(${index})">Eliminar</button>
      `;

      contenedor.appendChild(card);
    }
  });
}

function agregarPartido() {
  const equipo1 = document.getElementById('equipo1').value;
  const equipo2 = document.getElementById('equipo2').value;
  const resultado = document.getElementById('resultado').value;
  const goleadores = document.getElementById('goleadores').value.split(',').map(g => g.trim());
  const amarillas = document.getElementById('jugadoresAmarillas').value.split(',').map(a => a.trim());
  const rojas = document.getElementById('jugadoresRojas').value.split(',').map(r => r.trim());

  if (equipo1 && equipo2 && resultado) {
    partidos.push({
      equipo1,
      equipo2,
      resultado,
      goleadores,
      amarillas,
      rojas
    });

    localStorage.setItem('partidos', JSON.stringify(partidos));
    mostrarResultados();
    document.querySelectorAll('.form-container input').forEach(input => input.value = '');
  } else {
    alert('Por favor, complete todos los campos.');
  }
}

function editarPartido(index) {
  const partido = partidos[index];

  const nuevoGoleadores = prompt("Editar goleadores:", partido.goleadores.join(', '));
  const nuevoAmarillas = prompt("Editar jugadores con amarilla:", partido.amarillas.join(', '));
  const nuevoRojas = prompt("Editar jugadores con roja:", partido.rojas.join(', '));

  if (nuevoGoleadores !== null) partido.goleadores = nuevoGoleadores.split(',').map(g => g.trim());
  if (nuevoAmarillas !== null) partido.amarillas = nuevoAmarillas.split(',').map(a => a.trim());
  if (nuevoRojas !== null) partido.rojas = nuevoRojas.split(',').map(r => r.trim());

  localStorage.setItem('partidos', JSON.stringify(partidos));
  mostrarResultados();
}

function eliminarPartido(index) {
  if (confirm("¿Seguro que deseas eliminar este partido?")) {
    partidos.splice(index, 1);
    localStorage.setItem('partidos', JSON.stringify(partidos));
    mostrarResultados();
  }
}

function aplicarFiltros() {
  const filtros = {
    goleador: document.getElementById('filtroGoleador').value.trim(),
    resultado: document.getElementById('filtroResultado').value.trim(),
    amarillas: document.getElementById('filtroAmarillas').value.trim(),
    rojas: document.getElementById('filtroRojas').value.trim(),
  };

  mostrarResultados(filtros);
}

function resetFiltros() {
  document.querySelectorAll('.filter-container input').forEach(input => input.value = '');
  mostrarResultados();
}

mostrarResultados();
