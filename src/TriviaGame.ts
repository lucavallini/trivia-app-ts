export interface Pregunta { 
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

class TriviaGame{
    preguntas: Pregunta[] = [];
    preguntaActual: number = 0;
    puntaje: number = 0;

    constructor(){}

    iniciar(preguntas: Pregunta[]): void {
        this.preguntas = preguntas;  
        this.preguntaActual = 0;     
        this.puntaje = 0;            
    }

    getPreguntaActual(): Pregunta{
    return this.preguntas[this.preguntaActual]!;
    }

    responder(respuesta: string): boolean{
        if (respuesta === this.getPreguntaActual().correct_answer){
            this.puntaje+= 1
            return true
        } 
        else{
            return false
        }
    }

    siguiente(): void{
        this.preguntaActual += 1
    }

    haTerminado(): boolean{
        return this.preguntaActual >= this.preguntas.length;
    }

}

export default TriviaGame

