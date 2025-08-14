export default class MyButton extends HTMLElement {
    constructor() {
        super();
        
    }   
    
  connectedCallback() {
    this.innerHTML = `<button>Clique aqui!!!!!!!!!!!!!!!!!!!</button>`;
  }
}
customElements.define('my-button', MyButton);