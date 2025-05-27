const apiUrl = 'https://apidemo.geoeducacion.com.ar/api/testing/encuesta/1';

/*
Esta funcion se encarga de realizar la solicitud a la API para poder obtener los datos de los estudiantes,
es una funcion acsincrona lo que quiere decir que, no se detiene minetras realiza la solicitud y puede seguir
ejecutando el programa.
*/ 

async function fetchData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.data;
}

/*
Esta funcion se encarga de mostrar los datos de la pestaña seleccionada solamente
dependiendo del nombre de la pestaña se llama a la funcion correspondiente.
*/

function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    if (tabName === 'poblacion') {
        displayPoblacion();
    } else if (tabName === 'frecuencias') {
        displayFrecuencias();
    } else if (tabName === 'estadisticos') {
        displayEstadisticos();
    }
}

/*
Esta funcion recorre al tabla y se encarga de mostrar los datos solicitados.
*/

async function displayPoblacion() {
    const data = await fetchData();
    let html = '<table><tr><th>Nombre y Apellido</th><th>Edad</th><th>Curso</th><th>Nivel Educativo</th></tr>';
    data.forEach(item => {
        html += `<tr><td>${item.nombre} ${item.apellido}</td><td>${item.Edad}</td><td>${item.curso}</td><td>${item.nivel}</td></tr>`;
    });
    html += '</table>';
    document.getElementById('poblacion').innerHTML = html;
}

/*
La siguiente funcion es la que se encarga de calcular y mostrar las tablas de frecuencia para los 
niveles educativos y los cursos.
*/ 

async function displayFrecuencias() {
    const data = await fetchData();
    const niveles = {};
    const cursos = {};
    data.forEach(item => {
        niveles[item.nivel] = (niveles[item.nivel] || 0) + 1;
        cursos[item.curso] = (cursos[item.curso] || 0) + 1;
    });

    let html = '<h2>Tabla de Frecuencia de Niveles Educativos</h2>';
    html += '<table><tr><th>Nivel Educativo</th><th>Frecuencia Absoluta</th></tr>';
    for (const [nivel, freq] of Object.entries(niveles)) {
        html += `<tr><td>${nivel}</td><td>${freq}</td></tr>`;
    }
    html += '</table>';

    html += '<h2>Tabla de Frecuencia de Cursos</h2>';
    html += '<table><tr><th>Curso</th><th>Frecuencia Absoluta</th></tr>';
    for (const [curso, freq] of Object.entries(cursos)) {
        html += `<tr><td>${curso}</td><td>${freq}</td></tr>`;
    }
    html += '</table>';

    document.getElementById('frecuencias').innerHTML = html;
}

/*
Esta funcion se utiliza casi de la misma manera que la anterior funcion pero para los datos estadisticos
pero utilizando como dato principal la variable edad.
*/

async function displayEstadisticos() {
    const data = await fetchData();
    const edades = data.map(item => item.Edad);
    const media = edades.reduce((a, b) => a + b, 0) / edades.length;
    const mediana = edades.sort((a, b) => a - b)[Math.floor(edades.length / 2)];
    const max = Math.max(...edades);
    const min = Math.min(...edades);
    const q1 = edades[Math.floor(edades.length / 4)];
    const q2 = mediana;
    const stdDev = Math.sqrt(edades.map(x => Math.pow(x - media, 2)).reduce((a, b) => a + b) / edades.length);

    let html = '<h2>Estadísticos de Edad</h2>';
    html += `<table>
                <tr><th>Media</th><td>${media.toFixed(2)}</td></tr>
                <tr><th>Mediana</th><td>${mediana}</td></tr>
                <tr><th>Valor Máximo</th><td>${max}</td></tr>
                <tr><th>Valor Mínimo</th><td>${min}</td></tr>
                <tr><th>Primer Cuartil</th><td>${q1}</td></tr>
                <tr><th>Segundo Cuartil</th><td>${q2}</td></tr>
                <tr><th>Desvío Estándar</th><td>${stdDev.toFixed(2)}</td></tr>
            </table>`;
    document.getElementById('estadisticos').innerHTML = html;
}

