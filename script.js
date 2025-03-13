/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */


const partidos = JSON.parse(localStorage.getItem('partidos')) || [];

function mostrarResultados() {
  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = "";
  partidos.forEach((partido, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = 
      <h2>${partido.equipo1} vs ${partido.equipo2}</h2>
      <p class="stat"><span class="highlight">Resultado:</span> ${partido.resultado}</p>
      <p class="stat"><span class="highlight">Goleadores:</span> ${partido.goleadores.length > 0 ? partido.goleadores.join(', ') : 'Ninguno'}</p>
      <p class="stat"><span class="highlight">Tarjetas Amarillas:</span> ${partido.tarjetas.amarillas}</p>
      <p class="stat"><span class="highlight">Tarjetas Rojas:</span> ${partido.tarjetas.rojas}</p>
      <p class="stat"><span class="highlight">Fair Play:</span> ${partido.fairPlay}/10</p>
      <button class="btn-eliminar" onclick="eliminarPartido(${index})">Eliminar</button>
    ;
    contenedor.appendChild(card);
  });
}

function agregarPartido() {
  const equipo1 = document.getElementById('equipo1').value;
  const equipo2 = document.getElementById('equipo2').value;
  const resultado = document.getElementById('resultado').value;
  const goleadores = document.getElementById('goleadores').value.split(',').map(g => g.trim()).filter(g => g);
  const amarillas = parseInt(document.getElementById('amarillas').value);
  const rojas = parseInt(document.getElementById('rojas').value);
  const fairPlay = parseInt(document.getElementById('fairPlay').value);

  if (equipo1 && equipo2 && resultado && !isNaN(amarillas) && !isNaN(rojas) && !isNaN(fairPlay)) {
    partidos.push({
      equipo1,
      equipo2,
      resultado,
      goleadores,
      tarjetas: { amarillas, rojas },
      fairPlay
    });

    localStorage.setItem('partidos', JSON.stringify(partidos));
    mostrarResultados();
    document.querySelectorAll('.form-container input').forEach(input => input.value = '');
    mostrarMensaje("¡Carga realizada con éxito!");
  } else {
    alert('Por favor, complete todos los campos correctamente.');
  }
}

function eliminarPartido(index) {
  if (confirm("¿Estás seguro de que querés eliminar este partido?")) {
    partidos.splice(index, 1);
    localStorage.setItem('partidos', JSON.stringify(partidos));
    mostrarResultados();
    mostrarMensaje("Partido eliminado correctamente.");
  }
}

function mostrarMensaje(mensaje) {
  const mensajeDiv = document.createElement('div');
  mensajeDiv.classList.add('mensaje-exito');
  mensajeDiv.textContent = mensaje;
  document.body.appendChild(mensajeDiv);

  setTimeout(() => {
    mensajeDiv.remove();
  }, 3000);
}

mostrarResultados();