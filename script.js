/**
* Objetivos: 
*-Usar variables 
*-Usar array 
*-Usar funciones 
*-Usar algún ciclo 
* */

// Al cargar la página de resultados, mostrar los partidos guardados
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("resultados")) {
        mostrarPartidos();
    }
});

// Función para agregar un partido
function agregarPartido() {
    const fechaPartido = document.getElementById("fechaPartido").value;
    const equipo1 = document.getElementById("equipo1").value;
    const equipo2 = document.getElementById("equipo2").value;
    const resultado = document.getElementById("resultado").value;

    // Validar que los campos obligatorios no estén vacíos
    if (!fechaPartido || !equipo1 || !equipo2 || !resultado) {
        Swal.fire("Error", "Completa los campos obligatorios", "error");
        return;
    }

    // Crear objeto de partido y guardarlo en LocalStorage
    const partido = { fechaPartido, equipo1, equipo2, resultado };
    localStorage.setItem("partido", JSON.stringify(partido));

    // Mostrar mensaje de éxito
    Swal.fire("Éxito", "Partido agregado correctamente", "success");
}

// Función para mostrar los partidos guardados en la página de resultados
function mostrarPartidos() {
    const partido = JSON.parse(localStorage.getItem("partido"));
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";

    if (partido) {
        resultadosDiv.innerHTML += `
            <div class="card p-3 mb-2">
                <h5>${partido.fechaPartido}: ${partido.equipo1} vs ${partido.equipo2}</h5>
                <p><strong>Resultado:</strong> ${partido.resultado}</p>
            </div>`;
    }
}
