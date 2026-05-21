import TriviaApi from "./TriviaAPI.js";
import TriviaGame from "./TriviaGame.js";
import '../js/components/pantalla-inicio.js';
import '../js/components/pantalla-juego.js';
import '../js/components/pantalla-final.js';
import '../js/components/pantalla-error.js';
import '../js/components/pantalla-cargando.js';
import '../js/components/boton-respuesta.js';
const api = new TriviaApi();
const game = new TriviaGame();
mostrarPantalla('pantalla-inicio');
function decodificarHTML(texto) {
    const el = document.createElement('textarea');
    el.innerHTML = texto;
    return el.value;
}
function mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
async function categories() {
    const categorias = await api.getCategorias();
    const selectCategorias = document.getElementById('categorias');
    selectCategorias.innerHTML = categorias.map((c) => `
        <option value="${c.id}">${c.name}</option>
        `).join('');
}
function mostrarPantalla(id) {
    document.querySelectorAll('pantalla-inicio, pantalla-juego, pantalla-final, pantalla-error, pantalla-cargando')
        .forEach(p => p.style.display = 'none');
    const pantalla = document.querySelector(id);
    pantalla.style.display = 'flex';
}
function mostrarPregunta() {
    const pregunta = game.getPreguntaActual();
    const numPreg = document.getElementById('num-preg');
    const preg = document.getElementById('preg');
    numPreg.innerHTML = `Pregunta ${game.preguntaActual + 1} de 10`;
    preg.innerHTML = decodificarHTML(pregunta.question);
}
function mostrarRespuestas(pregunta = game.getPreguntaActual()) {
    const respuestas = mezclar([...pregunta.incorrect_answers, pregunta.correct_answer]);
    const grupoRespuestas = document.getElementById('grp-rta');
    grupoRespuestas.innerHTML = '';
    respuestas.map((r) => {
        const boton = document.createElement('boton-respuesta');
        boton.setAttribute('texto', decodificarHTML(r));
        boton.dataset.respuesta = r;
        grupoRespuestas.appendChild(boton);
    });
}
function juego() {
    mostrarPregunta();
    mostrarRespuestas();
}
function getHistorial() {
    const historial = JSON.parse(localStorage.getItem('historial') || '[]');
    historial.push(game.puntaje);
    if (historial.length > 5) {
        historial.shift();
    }
    localStorage.setItem('historial', JSON.stringify(historial));
    const historialElemento = document.getElementById('historial');
    historialElemento.innerHTML = `<p>Las ultimas ${historial.length} partidas:</p>`
        + historial.map((h) => `
        <p class="font-col-lght-prpl font-weight-600">${h}pts.</p>
        `).join('');
}
function mostrarResultado() {
    mostrarPantalla('pantalla-final');
    const puntajeFinal = document.getElementById('puntaje-final');
    puntajeFinal.innerHTML = `Obtuviste ${game.puntaje} de 10`;
}
function final() {
    mostrarResultado();
    getHistorial();
}
document.addEventListener('DOMContentLoaded', () => {
    categories();
    const btnJugar = document.getElementById('btn-jugar');
    const btnReintentar = document.getElementById('btn-reintentar');
    const btnVolver = document.getElementById('btn-volver');
    const grupoRespuestas = document.getElementById('grp-rta');
    btnJugar
        .addEventListener('click', async () => {
        mostrarPantalla('pantalla-cargando');
        const categoria = document.getElementById('categorias').value;
        const dificultad = document.getElementById('dificultades').value;
        try {
            const preguntas = await api.getPreguntas(10, categoria, dificultad);
            game.iniciar(preguntas);
            mostrarPantalla('pantalla-juego');
            juego();
        }
        catch {
            mostrarPantalla('pantalla-error');
        }
    });
    btnReintentar.addEventListener('click', () => {
        mostrarPantalla('pantalla-inicio');
    });
    btnVolver.addEventListener('click', () => {
        mostrarPantalla('pantalla-inicio');
    });
    grupoRespuestas.addEventListener('click', (event) => {
        const target = event.target;
        const boton = target.closest('boton-respuesta');
        if (boton) {
            const respuesta = boton.dataset.respuesta || '';
            const rta = game.responder(respuesta);
            boton.setAttribute('estado', rta ? 'boton-correcto' : 'boton-incorrecto');
            if (!rta) {
                const respuestaCorrecta = game.getPreguntaActual().correct_answer;
                document.querySelectorAll('boton-respuesta').forEach(b => {
                    const botonRespuesta = b;
                    if (botonRespuesta.dataset.respuesta === respuestaCorrecta) {
                        botonRespuesta.setAttribute('estado', 'boton-correcto');
                    }
                });
            }
            game.siguiente();
            setTimeout(() => {
                if (game.haTerminado()) {
                    final();
                }
                else {
                    juego();
                }
            }, 1000);
        }
    });
});
