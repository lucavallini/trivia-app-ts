const template = document.createElement('template');
template.innerHTML = `
        <h2 class="title font-col-blck">Hubo un error al cargar las preguntas.</h2>
        <button class="btn" id="btn-reintentar">Reintentar</button>
`;

class PantallaError extends HTMLElement {
    connectedCallback(){

        this.classList.add('container');
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }
}

customElements.define('pantalla-error', PantallaError);
export default PantallaError;
