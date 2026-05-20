import TriviaApi from "./TriviaAPI.js";
import TriviaGame from "./TriviaGame.js";
import './components/pantalla-inicio.js';
import './components/pantalla-juego.js';
import './components/pantalla-final.js';
import './components/pantalla-error.js';
import './components/pantalla-cargando.js';
import './components/boton-respuesta.js';

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
    const categorias = await api.getCategorias()
    document.getElementById('categorias').innerHTML = categorias.map(c => `
        <option value="${c.id}">${c.name}</option>
        `).join('')
}


function mostrarPantalla(id) {
    document.querySelectorAll('pantalla-inicio, pantalla-juego, pantalla-final, pantalla-error, pantalla-cargando')
        .forEach(p => p.style.display = 'none');
    document.querySelector(id).style.display = 'flex';
}


function mostrarPregunta() { 
    const pregunta = game.getPreguntaActual()
    document.getElementById('num-preg').innerHTML = `Pregunta ${game.preguntaActual + 1} de 10`
    document.getElementById('preg').innerHTML = decodificarHTML(pregunta.question)
}


function mostrarRespuestas(pregunta = game.getPreguntaActual()) {
    const respuestas = mezclar([... pregunta.incorrect_answers, pregunta.correct_answer]);
    const grupoRespuestas = document.getElementById('grp-rta');

    grupoRespuestas.innerHTML = '';
    respuestas.map(r => {
        const boton = document.createElement('boton-respuesta');
        boton.setAttribute('texto', decodificarHTML(r));
        boton.dataset.respuesta = r;
        grupoRespuestas.appendChild(boton);
    });
}


function juego(){
    return mostrarPregunta(), mostrarRespuestas();
}

function getHistorial(){
    const historial = JSON.parse(localStorage.getItem('historial'))||[];

    historial.push(game.puntaje);

    if (historial.length > 5){
        historial.shift();
    }
    localStorage.setItem('historial', JSON.stringify(historial));

    document.getElementById('historial').innerHTML = `<p>Las ultimas ${historial.length} partidas:</p>`
    + historial.map(h =>
        `
        <p class="font-col-lght-prpl font-weight-600">${h}pts.</p>
        `
    ).join('')
}

function mostrarResultado() { 
    mostrarPantalla('pantalla-final')
    document.getElementById('puntaje-final').innerHTML = `Obtuviste ${game.puntaje} de 10`
}

function final(){
    return mostrarResultado(), getHistorial();
}


document.addEventListener('DOMContentLoaded', () => {
    categories();

    document.getElementById('btn-jugar')
        .addEventListener('click', async () => {
            mostrarPantalla('pantalla-cargando')
            const categoria = document.getElementById('categorias').value;
            const dificultad = document.getElementById('dificultades').value;
            try{
                const preguntas = await api.getPreguntas(10, categoria, dificultad);
                game.iniciar(preguntas);
                mostrarPantalla('pantalla-juego');
                juego();
            }
            catch{
                mostrarPantalla('pantalla-error');
            }
        });


        document.getElementById('btn-reintentar').addEventListener('click', () => {
            mostrarPantalla('pantalla-inicio');
        });
        
        document.getElementById('btn-volver').addEventListener('click', () => {
            mostrarPantalla('pantalla-inicio');
        });

    document.getElementById('grp-rta').addEventListener('click', (event) => {
        const boton = event.target.closest('boton-respuesta');

        if (boton){
            const respuesta = boton.dataset.respuesta;
            const rta = game.responder(respuesta);

            boton.setAttribute('estado', rta ? 'boton-correcto' : 'boton-incorrecto');
            if (!rta){
                const respuestaCorrecta = game.getPreguntaActual().correct_answer;
                document.querySelectorAll('boton-respuesta').forEach(b => {
                    if (b.dataset.respuesta === respuestaCorrecta){
                        b.setAttribute('estado', 'boton-correcto');
                    }
                });
            }
            game.siguiente()
            setTimeout(()=>{
                if (game.haTerminado()){
                    final();
                }
                else{
                juego();
                }
            }, 1000)
        }
    });
});
