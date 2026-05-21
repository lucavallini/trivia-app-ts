class TriviaApi {
    async getPreguntas(cantidad = 10, categoria = '', dificultad = '') {
        const url = `${TriviaApi.BASE_URL}/api.php?amount=${cantidad}&category=${categoria}&difficulty=${dificultad}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error en la respuesta');
            }
            const data = await response.json();
            return data.results;
        }
        catch (e) {
            console.log(e);
            throw new Error('Error en la respuesta');
        }
    }
    async getCategorias() {
        const url = `${TriviaApi.BASE_URL}/api_category.php`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error en la respuesta');
            }
            const data = await response.json();
            return data.trivia_categories;
        }
        catch {
            throw new Error('Error en la respuesta');
        }
    }
}
TriviaApi.BASE_URL = 'https://opentdb.com';
export default TriviaApi;
