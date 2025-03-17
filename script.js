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
    } else {
        alert("Ingrese un nombre válido y no repetido.");
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

    actualizarFechasDisponibles();
    mostrarGoleadoresPorFecha();
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

    if (!fecha || !equipo1 || !equipo2 || equipo1 === equipo2) {
        alert('Por favor, complete los datos correctamente.');
        return;
    }

    partidos.push({ fecha, equipo1, equipo2, resultado, goleadores });
    localStorage.setItem('partidos', JSON.stringify(partidos));

    mostrarResultados();
    mostrarTablaPosiciones();
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

// Mostrar los goleadores por fecha
function mostrarGoleadoresPorFecha() {
    const fecha = document.getElementById('filtroFecha').value;
    const filtrados = fecha ? partidos.filter(p => p.fecha === fecha) : partidos;

    const contenedor = document.getElementById('goleadoresFecha');
    contenedor.innerHTML = "<h3>Goleadores</h3>";

    filtrados.forEach(partido => {
        partido.goleadores.forEach(goleador => {
            contenedor.innerHTML += `<p>${goleador.nombre} (${goleador.equipo}): ${goleador.goles} goles</p>`;
        });
    });
}

// Filtrar por fecha
function filtrarPorFecha() {
    const fecha = document.getElementById('filtroFecha').value;
    const filtrados = fecha ? partidos.filter(p => p.fecha === fecha) : partidos;
    mostrarResultados(filtrados);
    mostrarGoleadoresPorFecha();
    mostrarTablaPosiciones();
}

// Mostrar tabla de posiciones
function mostrarTablaPosiciones() {
    const tabla = {};
    partidos.forEach(partido => {
        const [goles1, goles2] = partido.resultado.split('-').map(Number);
        if (!tabla[partido.equipo1]) tabla[partido.equipo1] = { ganados: 0 };
        if (!tabla[partido.equipo2]) tabla[partido.equipo2] = { ganados: 0 };

        if (goles1 > goles2) tabla[partido.equipo1].ganados++;
        else if (goles2 > goles1) tabla[partido.equipo2].ganados++;
    });

    const contenedor = document.getElementById('tablaPosiciones');
    contenedor.innerHTML = "<h3>Tabla de Posiciones</h3>";
    Object.entries(tabla).sort((a, b) => b[1].ganados - a[1].ganados)
        .forEach(([equipo, stats]) => contenedor.innerHTML += `<p>${equipo}: ${stats.ganados} ganados</p>`);
}

// Inicializar
actualizarSelectEquipos();
mostrarResultados();
