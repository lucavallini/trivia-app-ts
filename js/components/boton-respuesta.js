const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            width: 100%;
        }

        button {
            width:100%;
            height:2rem;
            border-radius: 10px;
            cursor: pointer;
            border: none;
            font-size: 1rem;
        }
    
        .boton-correcto {background-color: #14532D; color: #fff;}
        .boton-incorrecto{background-color: #7F1D1D; color: #fff;}
    </style>
    <button></button>
`  
class BotonRespuesta extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes(){
        return ['texto', 'estado'];
    }

    connectedCallback(){

        const content = template.content.cloneNode(true);
        this.shadowRoot.appendChild(content);
        this.shadowRoot.querySelector('button').textContent = this.getAttribute('texto');
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === 'estado') {
            const button = this.shadowRoot.querySelector('button');
            if (button){button.className = newValue}
        }
    }
}

customElements.define('boton-respuesta', BotonRespuesta);
export default BotonRespuesta;
