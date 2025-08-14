export default class Card extends HTMLElement {
    #valor: number = 0;

    constructor() {
        super();
        
    }   

    set valor(value: number) {
        this.#valor = value;
    }

    get valor(): number {
        return this.#valor;
    }

    
}
customElements.define('card', Card);