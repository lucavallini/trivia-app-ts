const template = document.createElement('template');
template.innerHTML = `
    <style>
        h2 {
            color: #000;
            font-size: 2rem;
            font-family: 'Segoe UI', sans-serif;
        }
    </style>

    <h2>Cargando...</h2>
`;

class PantallaCargando extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(){

        const content = template.content.cloneNode(true);
        this.shadowRoot.appendChild(content);
    }
}
customElements.define('pantalla-cargando', PantallaCargando);
export default PantallaCargando;
