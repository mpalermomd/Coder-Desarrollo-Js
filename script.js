/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

let partidos = JSON.parse(localStorage.getItem('partidos')) || [];
let galeria = JSON.parse(localStorage.getItem('galeria')) || [];

function encodeImageFileAsURL(input, previewId, callback) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
            document.getElementById(previewId).src = reader.result;
            document.getElementById(previewId).style.display = 'block';
            callback(reader.result);
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById('escudo1').addEventListener('change', function () {
    encodeImageFileAsURL(this, 'previewEscudo1', (base64) => {});
});

document.getElementById('escudo2').addEventListener('change', function () {
    encodeImageFileAsURL(this, 'previewEscudo2', (base64) => {});
});

document.getElementById('fotoGoleador').addEventListener('change', function () {
    encodeImageFileAsURL(this, 'previewFotoGoleador', (base64) => {});
});

function agregarPartido() {
    const equipo1 = document.getElementById('equipo1').value;
    const equipo2 = document.getElementById('equipo2').value;
    const resultado = document.getElementById('resultado').value;
    const goleadores = document.getElementById('goleadores').value.split(',').map(g => g.trim()).filter(g => g);
    const amarillas = parseInt(document.getElementById('amarillas').value);
    const rojas = parseInt(document.getElementById('rojas').value);
    const fairPlay = parseInt(document.getElementById('fairPlay').value);
    const escudo1 = document.getElementById('previewEscudo1').src;
    const escudo2 = document.getElementById('previewEscudo2').src;
    const fotoGoleador = document.getElementById('previewFotoGoleador').src;

    if (equipo1 && equipo2 && resultado && !isNaN(amarillas) && !isNaN(rojas) && !isNaN(fairPlay)) {
        partidos.push({
            equipo1, equipo2, resultado, goleadores, fotoGoleador,
            tarjetas: { amarillas, rojas }, fairPlay, escudo1, escudo2
        });

        localStorage.setItem('partidos', JSON.stringify(partidos));
        mostrarResultados();
        Swal.fire("¡Carga realizada con éxito!", "", "success");
    } else {
        alert('Complete todos los campos correctamente.');
    }
}

function mostrarResultados() {
    const contenedor = document.getElementById('resultados');
    contenedor.innerHTML = "";
    partidos.forEach((partido, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h2>
                <img src="${partido.escudo1}" class="preview-img"> ${partido.equipo1} vs ${partido.equipo2}
                <img src="${partido.escudo2}" class="preview-img">
            </h2>
            <p>Resultado: ${partido.resultado}</p>
            <p>Goleadores: ${partido.goleadores.join(', ') || 'Ninguno'}</p>
            ${partido.fotoGoleador ? `<img src="${partido.fotoGoleador}" class="preview-img">` : ""}
            <p>Tarjetas: ${partido.tarjetas.amarillas} amarillas, ${partido.tarjetas.rojas} rojas</p>
            <p>Fair Play: ${partido.fairPlay}/10</p>
            <button class="btn-eliminar" onclick="eliminarPartido(${index})">Eliminar</button>
        `;
        contenedor.appendChild(card);
    });
}

function eliminarPartido(index) {
    Swal.fire({
        title: "¿Eliminar partido?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            partidos.splice(index, 1);
            localStorage.setItem('partidos', JSON.stringify(partidos));
            mostrarResultados();
            Swal.fire("Eliminado", "", "success");
        }
    });
}

function subirArchivo() {
    const archivo = document.getElementById('archivoGaleria').files[0];
    if (archivo) {
        const reader = new FileReader();
        reader.onloadend = function () {
            galeria.push({ tipo: archivo.type.includes("video") ? "video" : "imagen", src: reader.result });
            localStorage.setItem('galeria', JSON.stringify(galeria));
            mostrarGaleria();
        };
        reader.readAsDataURL(archivo);
    }
}

function mostrarGaleria() {
    document.getElementById('galeria').innerHTML = galeria.map(item => 
        `<${item.tipo} src="${item.src}" class="preview-img" ${item.tipo === "video" ? "controls" : ""}></${item.tipo}>`
    ).join('');
}

mostrarResultados();
mostrarGaleria();
