/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

const equipos = JSON.parse(localStorage.getItem('equipos')) || [];
const partidos = JSON.parse(localStorage.getItem('partidos')) || [];

// Actualizar los select de equipos dinámicamente
function actualizarSelectEquipos() {
    document.querySelectorAll('.select-equipo').forEach(select => {
        select.innerHTML = '<option value="">Seleccione equipo</option>';
        equipos.forEach(equipo => {
            select.innerHTML += `<option value="${equipo}">${equipo}</option>`;
        });
    });
}

// Agregar un nuevo equipo
function agregarEquipo() {
    const nombreEquipo = document.getElementById('nombreEquipo').value.trim();
    if (nombreEquipo && !equipos.includes(nombreEquipo)) {
        equipos.push(nombreEquipo);
        localStorage.setItem('equipos', JSON.stringify(equipos));
        actualizarSelectEquipos();
    }
    document.getElementById('nombreEquipo').value = "";
}

// Mostrar partidos guardados
function mostrarResultados(filtrados = partidos) {
    const contenedor = document.getElementById('resultados');
    contenedor.innerHTML = ""; 

    filtrados.forEach(partido => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h2>${partido.fecha} - ${partido.equipo1} vs ${partido.equipo2}</h2>
            <p><strong>Resultado:</strong> ${partido.resultado}</p>
            <p><strong>Goleadores:</strong> ${partido.goleadores.map(g => `${g.nombre} (${g.equipo}) - ${g.goles} goles`).join(', ') || 'Ninguno'}</p>
        `;
        contenedor.appendChild(card);
    });

    mostrarGoleadoresPorFecha();
    mostrarTablaPosiciones();
}

// Agregar un partido
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

    partidos.push({ fecha, equipo1, equipo2, resultado, goleadores });
    localStorage.setItem('partidos', JSON.stringify(partidos));

    actualizarFiltroFechas();
    mostrarResultados();
}

// Agregar un goleador
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

// Filtrar por fecha
function filtrarPorFecha() {
    const fecha = document.getElementById('filtroFecha').value;
    const filtrados = fecha ? partidos.filter(p => p.fecha === fecha) : partidos;
    mostrarResultados(filtrados);
}

// Actualizar filtro de fechas
function actualizarFiltroFechas() {
    const filtroFecha = document.getElementById('filtroFecha');
    const fechas = [...new Set(partidos.map(p => p.fecha))];
    filtroFecha.innerHTML = `<option value="">Mostrar todas</option>`;
    fechas.forEach(fecha => {
        filtroFecha.innerHTML += `<option value="${fecha}">${fecha}</option>`;
    });
}

// Inicializar
actualizarSelectEquipos();
actualizarFiltroFechas();
mostrarResultados();
