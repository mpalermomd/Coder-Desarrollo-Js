const partidos = JSON.parse(localStorage.getItem('partidos')) || [];

function mostrarResultados(filtros = {}) {
  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = "";

  partidos.forEach((partido, index) => {
    let mostrar = true;

    // Aplicar filtros
    if (filtros.filtroCategoria && filtros.filtroInput) {
      const filtroInput = filtros.filtroInput.toLowerCase();

      if (filtros.filtroCategoria === "goleadores" && !partido.goleadores.some(g => g.toLowerCase().includes(filtroInput))) {
        mostrar = false;
      }

      if (filtros.filtroCategoria === "resultado" && !partido.resultado.includes(filtroInput)) {
        mostrar = false;
      }

      if (filtros.filtroCategoria === "amarillas" && !partido.amarillas.some(a => a.toLowerCase().includes(filtroInput))) {
        mostrar = false;
      }

      if (filtros.filtroCategoria === "rojas" && !partido.rojas.some(r => r.toLowerCase().includes(filtroInput))) {
        mostrar = false;
      }

      if (filtros.filtroCategoria === "equipo" && !(partido.equipo1.toLowerCase().includes(filtroInput) || partido.equipo2.toLowerCase().includes(filtroInput))) {
        mostrar = false;
      }
    }

    if (mostrar) {
      const card = document.createElement('div');
      card.classList.add('card');

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
        <p><strong>Goles del equipo 1:</strong> ${partido.goles1.join(', ')}</p>
        <p><strong>Goleadores del equipo 1:</strong> ${partido.goleadores1.join(', ')}</p>
        <p><strong>Goles del equipo 2:</strong> ${partido.goles2.join(', ')}</p>
        <p><strong>Goleadores del equipo 2:</strong> ${partido.goleadores2.join(', ')}</p>
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
  const goles1 = document.getElementById('goleadores').value.split(',').map(g => g.trim());
  const goleadores1 = goles1.slice(0, goles1.length / 2);
  const goles2 = goles1.slice(goles1.length / 2);
  const goleadores2 = goles1.slice(goleadores1.length);

  const amarillas = document.getElementById('amarillas').value.split(',').map(a => a.trim());
  const rojas = document.getElementById('rojas').value.split(',').map(r => r.trim());

  if (equipo1 && equipo2 && resultado) {
    partidos.push({
      equipo1,
      equipo2,
      resultado,
      goles1,
      goleadores1,
      goles2,
      goleadores2,
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

function aplicarFiltros() {
  const categoria = document.getElementById('filtroCategoria').value;
  const input = document.getElementById('filtroInput').value;

  mostrarResultados({
    filtroCategoria: categoria,
    filtroInput: input
  });
}

function resetFiltros() {
  document.getElementById('filtroInput').value = '';
  mostrarResultados();
}

mostrarResultados();
