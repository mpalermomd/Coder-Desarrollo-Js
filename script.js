/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */



// Recuperar equipos y partidos desde localStorage o inicializar vacío
const equipos = JSON.parse(localStorage.getItem('equipos')) || [];
const partidos = JSON.parse(localStorage.getItem('partidos')) || [];

// Actualizar los select de equipos dinámicamente
function actualizarSelectEquipos() {
    const selects = document.querySelectorAll('.select-equipo');
    selects.forEach(select => {
        select.innerHTML = '<option value="">Seleccione equipo</option>';
        equipos.forEach(equipo => {
            const option = document.createElement('option');
            option.value = equipo;
            option.textContent = equipo;
            select.appendChild(option);
        });
    });
}

// Agregar un nuevo equipo a la base de datos
function agregarEquipo() {
    const nombreEquipo = document.getElementById('nombreEquipo').value.trim();
    if (nombreEquipo && !equipos.includes(nombreEquipo)) {
        equipos.push(nombreEquipo);
        localStorage.setItem('equipos', JSON.stringify(equipos));
        actualizarSelectEquipos();
        mostrarMensaje("¡Equipo agregado con éxito!");
    } else {
        alert("Ingrese un nombre válido y no repetido.");
    }
    document.getElementById('nombreEquipo').value = "";
}

// Mostrar partidos guardados
function mostrarResultados(filtrados = partidos) {
    const contenedor = document.getElementById('resultados');
    contenedor.innerHTML = ""; 

    filtrados.forEach((partido, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h2>${partido.fecha} - ${partido.equipo1} vs ${partido.equipo2}</h2>
            <p class="stat"><strong>Resultado:</strong> ${partido.resultado}</p>
            <p class="stat"><strong>Goleadores:</strong> ${
                partido.goleadores.length > 0 
                    ? partido.goleadores.map(g => `${g.nombre} (${g.equipo}, ${g.goles} goles)`).join(', ') 
                    : 'Ninguno'
            }</p>
            <button onclick="eliminarPartido(${index})">Eliminar</button>
        `;
        contenedor.appendChild(card);
    });
}

// Agregar un partido a la base de datos
function agregarPartido() {
    const fecha = document.getElementById('fecha').value;
    const equipo1 = document.getElementById('equipo1').value;
    const equipo2 = document.getElementById('equipo2').value;
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

    if (!fecha || !equipo1 || !equipo2 || equipo1 === equipo2) {
        alert('Por favor, complete los datos correctamente.');
        return;
    }

    partidos.push({ fecha, equipo1, equipo2, resultado, goleadores });
    localStorage.setItem('partidos', JSON.stringify(partidos));

    mostrarResultados();
    mostrarMensaje("¡Partido agregado con éxito!");
}

// Agregar un campo de goleador dinámicamente
function agregarGoleador() {
    const goleadorDiv = document.createElement('div');
    goleadorDiv.classList.add('goleador');
    goleadorDiv.innerHTML = `
        <input type="text" placeholder="Nombre del Jugador" class="nombre-goleador">
        <select class="equipo-goleador select-equipo"></select>
        <input type="number" placeholder="Goles" min="1" class="cantidad-goles">
        <button onclick="this.parentElement.remove()">-</button>
    `;
    document.getElementById('goleadores-container').appendChild(goleadorDiv);
    actualizarSelectEquipos();
}

// Eliminar un partido
function eliminarPartido(index) {
    if (confirm("¿Eliminar este partido?")) {
        partidos.splice(index, 1);
        localStorage.setItem('partidos', JSON.stringify(partidos));
        mostrarResultados();
        mostrarMensaje("Partido eliminado correctamente.");
    }
}

// Filtrar partidos por fecha
function filtrarPorFecha() {
    const fecha = document.getElementById('filtroFecha').value;
    const filtrados = partidos.filter(p => p.fecha === fecha);
    mostrarResultados(filtrados);
}

// Mostrar mensajes de éxito
function mostrarMensaje(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.classList.add('mensaje-exito');
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);
    setTimeout(() => mensajeDiv.remove(), 3000);
}

// Inicializar la aplicación
actualizarSelectEquipos();
mostrarResultados();
