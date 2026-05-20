const template = document.createElement('template');
    template.innerHTML = `
            <p id="num-preg"></p>
            <p id="preg"></p>
            <div class="grp-preg" id="grp-rta"></div>
        `;
class PantallaJuego extends HTMLElement {
    connectedCallback(){

        this.classList.add('container', 'bg-wht', 'border-soft', 'brd-col-wht', 'shadow-soft');
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }
}

customElements.define('pantalla-juego', PantallaJuego);
export default PantallaJuego;
