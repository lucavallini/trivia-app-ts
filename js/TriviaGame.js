class TriviaGame{
    constructor(){
        this.preguntas=[];
        this.preguntaActual=0;
        this.puntaje=0;
    }

    iniciar(preguntas){
        this.preguntas = preguntas;
        this.preguntaActual = 0;
        this.puntaje=0;
    }

    getPreguntaActual(){
    return this.preguntas[this.preguntaActual]
    }

    responder(respuesta){
        if (respuesta === this.getPreguntaActual().correct_answer){
            this.puntaje += 1
            return true
        } 
        else{
            return false
        }
    }

    siguiente(){
        this.preguntaActual += 1
    }

    haTerminado(){
        return this.preguntaActual >= this.preguntas.length;
    }

}

export default TriviaGame