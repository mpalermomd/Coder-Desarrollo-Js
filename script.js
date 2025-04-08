/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

const cloudName = 'dv5rrlzri';
const uploadPreset = 'Partidos';

// Subir archivo a Cloudinary
async function subirArchivo(archivo) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const formData = new FormData();
  formData.append('file', archivo);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data.secure_url;
}

// Agregar campos dinámicos
function agregarCampo(tipo) {
  const container = document.getElementById(`${tipo}Container`);
  const div = document.createElement('div');
  div.classList.add('row', 'g-2', 'mb-2');

  div.innerHTML = `
    <div class="col-md-5">
      <input type="text" class="form-control" placeholder="Nombre del jugador" name="${tipo}Nombre">
    </div>
    <div class="col-md-5">
      <input type="file" class="form-control" accept="image/*" name="${tipo}Imagen">
    </div>
    <div class="col-md-2">
      <button type="button" class="btn btn-danger w-100" onclick="eliminarCampo(this)">X</button>
    </div>
  `;
  container.appendChild(div);
}

// Eliminar campo dinámico
function eliminarCampo(boton) {
  boton.closest('.row').remove();
}

// Cargar partido
async function cargarPartido() {
  const equipo1 = document.getElementById('equipo1').value;
  const equipo2 = document.getElementById('equipo2').value;
  const resultado = document.getElementById('resultado').value;
  const fecha = document.getElementById('fecha').value;
  const fairPlay = document.getElementById('fairPlay').value;
  const escudo1 = document.getElementById('escudo1').files[0];
  const escudo2 = document.getElementById('escudo2').files[0];
  const recuerdos = document.getElementById('recuerdos').files;

  if (!equipo1 || !equipo2 || !resultado || !fecha || !escudo1 || !escudo2) {
    return Swal.fire('Faltan campos obligatorios', '', 'warning');
  }

  Swal.fire({
    title: 'Cargando partido...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  const escudo1Url = await subirArchivo(escudo1);
  const escudo2Url = await subirArchivo(escudo2);

  const cargarJugadores = async (tipo) => {
    const nombres = document.getElementsByName(`${tipo}Nombre`);
    const imagenes = document.getElementsByName(`${tipo}Imagen`);
    const jugadores = [];

    for (let i = 0; i < nombres.length; i++) {
      if (nombres[i].value && imagenes[i].files.length > 0) {
        const url = await subirArchivo(imagenes[i].files[0]);
        jugadores.push({ nombre: nombres[i].value, imagen: url });
      }
    }
    return jugadores;
  };

  const goleadores = await cargarJugadores('goleadores');
  const amarillas = await cargarJugadores('amarillas');
  const rojas = await cargarJugadores('rojas');

  const recuerdosUrls = [];
  for (let archivo of recuerdos) {
    const url = await subirArchivo(archivo);
    recuerdosUrls.push(url);
  }

  const partido = {
    equipo1,
    equipo2,
    resultado,
    fecha,
    fairPlay,
    escudo1Url,
    escudo2Url,
    goleadores,
    amarillas,
    rojas,
    recuerdos: recuerdosUrls
  };

  const partidos = JSON.parse(localStorage.getItem('partidos')) || [];
  partidos.push(partido);
  localStorage.setItem('partidos', JSON.stringify(partidos));

  Swal.fire('Partido cargado con éxito', '', 'success').then(() => {
    document.getElementById('formPartido').reset();
    window.location.reload();
  });
}

// Mostrar partidos en partidos.html
if (document.getElementById('listaPartidos')) {
  const partidos = JSON.parse(localStorage.getItem('partidos')) || [];
  const contenedor = document.getElementById('listaPartidos');
  const galeria = document.getElementById('galeria');

  partidos.forEach((p, index) => {
    const div = document.createElement('div');
    div.classList.add('card', 'mb-4', 'shadow');

    div.innerHTML = `
      <div class="card-body">
        <div class="row align-items-center mb-3">
          <div class="col-md-2 text-center">
            <img src="${p.escudo1Url}" class="img-fluid" alt="Escudo 1">
            <p class="fw-bold">${p.equipo1}</p>
          </div>
          <div class="col-md-2 text-center">
            <img src="${p.escudo2Url}" class="img-fluid" alt="Escudo 2">
            <p class="fw-bold">${p.equipo2}</p>
          </div>
          <div class="col-md-3">
            <p><strong>Resultado:</strong> ${p.resultado}</p>
            <p><strong>Fecha:</strong> ${p.fecha}</p>
            <p><strong>Fair Play:</strong> ${p.fairPlay}</p>
          </div>
          <div class="col-md-3">
            <p><strong>Goleadores:</strong></p>
            ${p.goleadores.map(g => `<div><img src="${g.imagen}" class="me-2" width="40">${g.nombre}</div>`).join('')}
          </div>
          <div class="col-md-2">
            <p><strong>Amarillas:</strong></p>
            ${p.amarillas.map(a => `<div><img src="${a.imagen}" class="me-2" width="30">${a.nombre}</div>`).join('')}
            <p><strong>Rojas:</strong></p>
            ${p.rojas.map(r => `<div><img src="${r.imagen}" class="me-2" width="30">${r.nombre}</div>`).join('')}
          </div>
        </div>
        <div class="text-end">
          <button class="btn btn-outline-danger btn-sm" onclick="eliminarPartido(${index})">Eliminar</button>
        </div>
      </div>
    `;
    contenedor.appendChild(div);

    // Galería de recuerdos
    p.recuerdos.forEach(url => {
      const media = document.createElement(url.includes('.mp4') ? 'video' : 'img');
      media.src = url;
      media.classList.add('galeria-item');
      if (url.includes('.mp4')) media.controls = true;

      const col = document.createElement('div');
      col.classList.add('col-md-3');
      col.appendChild(media);
      galeria.appendChild(col);
    });
  });
}

// Eliminar partido
function eliminarPartido(index) {
  Swal.fire({
    title: '¿Eliminar este partido?',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    icon: 'warning'
  }).then(result => {
    if (result.isConfirmed) {
      const partidos = JSON.parse(localStorage.getItem('partidos')) || [];
      partidos.splice(index, 1);
      localStorage.setItem('partidos', JSON.stringify(partidos));
      location.reload();
    }
  });
}
