import type { Pregunta } from './TriviaGame.js';

interface RespuestaAPI {
    results: Pregunta[];
}

interface Categoria {
    id: number;
    name: string;
}

interface RespuestaCategorias {
    trivia_categories: Categoria[];
}

class TriviaApi{
    static BASE_URL: string = 'https://opentdb.com';
    

    async getPreguntas(cantidad :number = 10, categoria: string = '', dificultad: string = ''): Promise <Pregunta[]>{
        const url: string = `${TriviaApi.BASE_URL}/api.php?amount=${cantidad}&category=${categoria}&difficulty=${dificultad}`;
        try{
            const response = await fetch(url)
            if (!response.ok){
                throw new Error('Error en la respuesta');
            }
            const data: RespuestaAPI = await response.json();
            return data.results
        }
        catch(e){
            console.log(e)
            throw new Error('Error en la respuesta')
        }
    }

    async getCategorias(): Promise<Categoria[]>{
        const url: string = `${TriviaApi.BASE_URL}/api_category.php`
        try{
            const response = await fetch(url)
            if (!response.ok){
                throw new Error('Error en la respuesta')
            }
            const data: RespuestaCategorias = await response.json()
            return data.trivia_categories
        }

        catch{
            throw new Error('Error en la respuesta')
        }
    }
}

export default TriviaApi
