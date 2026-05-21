import TriviaApi from "./TriviaAPI.js";
import TriviaGame from "./TriviaGame.js";
import '../js/components/pantalla-inicio.js';
import '../js/components/pantalla-juego.js';
import '../js/components/pantalla-final.js';
import '../js/components/pantalla-error.js';
import '../js/components/pantalla-cargando.js';
import '../js/components/boton-respuesta.js';

import type { Pregunta } from './TriviaGame.js';

interface Categoria {
    id: number;
    name: string;
}

const api = new TriviaApi();
const game = new TriviaGame();

mostrarPantalla('pantalla-inicio');

function decodificarHTML(texto:string):string {
    const el = document.createElement('textarea');
    el.innerHTML = texto;
    return el.value;
}

function mezclar(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j]!, array[i]!];
    }
    return array;
} 


async function categories(): Promise<void> {
    const categorias: Categoria[] = await api.getCategorias()
    const selectCategorias = document.getElementById('categorias') as HTMLSelectElement;

    selectCategorias.innerHTML = categorias.map((c: Categoria) => `
        <option value="${c.id}">${c.name}</option>
        `).join('')
}


function mostrarPantalla(id: string): void {
    document.querySelectorAll('pantalla-inicio, pantalla-juego, pantalla-final, pantalla-error, pantalla-cargando')
        .forEach(p => (p as HTMLElement).style.display = 'none');

    const pantalla = document.querySelector(id) as HTMLElement;
    pantalla.style.display = 'flex';
}


function mostrarPregunta(): void { 
    const pregunta: Pregunta = game.getPreguntaActual()
    const numPreg = document.getElementById('num-preg') as HTMLElement;
    const preg = document.getElementById('preg') as HTMLElement;

    numPreg.innerHTML = `Pregunta ${game.preguntaActual + 1} de 10`
    preg.innerHTML = decodificarHTML(pregunta.question)
}


function mostrarRespuestas(pregunta: Pregunta = game.getPreguntaActual()): void {
    const respuestas = mezclar([... pregunta.incorrect_answers, pregunta.correct_answer]);
    const grupoRespuestas = document.getElementById('grp-rta') as HTMLElement;

    grupoRespuestas.innerHTML = '';
    respuestas.map((r: string) => {
        const boton = document.createElement('boton-respuesta');
        boton.setAttribute('texto', decodificarHTML(r));
        boton.dataset.respuesta = r;
        grupoRespuestas.appendChild(boton);
    });
}


function juego(): void {
    mostrarPregunta();
    mostrarRespuestas();
}

function getHistorial(): void{
    const historial: number[] = JSON.parse(localStorage.getItem('historial') || '[]');

    historial.push(game.puntaje);

    if (historial.length > 5){
        historial.shift();
    }
    localStorage.setItem('historial', JSON.stringify(historial));

    const historialElemento = document.getElementById('historial') as HTMLElement;
        historialElemento.innerHTML = `<p>Las ultimas ${historial.length} partidas:</p>`
        + historial.map((h: number) =>
        `
        <p class="font-col-lght-prpl font-weight-600">${h}pts.</p>
        `
    ).join('')
}

function mostrarResultado():void { 
    mostrarPantalla('pantalla-final')
    const puntajeFinal = document.getElementById('puntaje-final') as HTMLElement;
    puntajeFinal.innerHTML = `Obtuviste ${game.puntaje} de 10`
}

function final():void{
    mostrarResultado();
    getHistorial();
}


document.addEventListener('DOMContentLoaded', () => {
    categories();

    const btnJugar = document.getElementById('btn-jugar') as HTMLButtonElement;
    const btnReintentar = document.getElementById('btn-reintentar') as HTMLButtonElement;
    const btnVolver = document.getElementById('btn-volver') as HTMLButtonElement;
    const grupoRespuestas = document.getElementById('grp-rta') as HTMLElement;

    btnJugar
        .addEventListener('click', async () => {
            mostrarPantalla('pantalla-cargando')
            const categoria = (document.getElementById('categorias') as HTMLSelectElement).value;
            const dificultad = (document.getElementById('dificultades') as HTMLSelectElement).value;
            try{
                const preguntas: Pregunta[] = await api.getPreguntas(10, categoria, dificultad);
                game.iniciar(preguntas);
                mostrarPantalla('pantalla-juego');
                juego();
            }
            catch{
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
        const target = event.target as Element;
        const boton = target.closest('boton-respuesta') as HTMLElement;

        if (boton){
            const respuesta = boton.dataset.respuesta || '';
            const rta: boolean = game.responder(respuesta);

            boton.setAttribute('estado', rta ? 'boton-correcto' : 'boton-incorrecto');
            if (!rta){
                const respuestaCorrecta: string = game.getPreguntaActual().correct_answer;
                document.querySelectorAll('boton-respuesta').forEach(b => {
                    const botonRespuesta = b as HTMLElement;

                    if (botonRespuesta.dataset.respuesta === respuestaCorrecta){
                        botonRespuesta.setAttribute('estado', 'boton-correcto');
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
