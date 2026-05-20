const template = document.createElement('template');
template.innerHTML = `
        <h2 class="title font-col-blck" id="puntaje-final"></h2>
        <div class="flex-row" id="historial"></div>
        <button class="btn bg-lvndr font-col-prpl brd-col-lvndr" id="btn-volver">Volver a jugar</button>
`;

class PantallaFinal extends HTMLElement {
    connectedCallback(){

        this.classList.add ('card', 'bg-wht', 'border-soft', 'brd-col-wht', 'shadow-soft');
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }
}

customElements.define('pantalla-final', PantallaFinal);
export default PantallaFinal;
