const template = document.createElement('template');

template.innerHTML = `
    <h1 class="title font-col-prpl">Trivia-Game</h1>

    <div class="selector">
        <label class="font-col-lght-prpl font-weight-600"
        for="categorias">
            Elige la categoria
        </label>

        <select class="select-style"
        name="categoria"
        id="categorias"></select>
    </div>

    <div class="selector">
        <label class="font-col-lght-prpl font-weight-600"
        for="dificultades">
            Elige la dificultad
        </label>

        <select class="select-style"
        name="dificultad"
        id="dificultades">

            <option value="easy">Facil</option>
            <option value="medium">Medio</option>
            <option value="hard">Dificil</option>

        </select>
    </div>

    <button
    class="btn font-weight-600 bg-lght-prpl font-col-wht"
    id="btn-jugar">

        Jugar

    </button>
`;

class PantallaInicio extends HTMLElement {
    connectedCallback(){

        this.classList.add('container','bg-wht','border-soft','brd-col-wht','shadow-soft');
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }
}

customElements.define('pantalla-inicio', PantallaInicio);
export default PantallaInicio;
