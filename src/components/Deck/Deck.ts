import "./Deck.css";

export default class Deck extends HTMLElement {

    #cartasRestantes: number = 44;

    constructor() {
            super();
        }

    connectedCallback() {
        document.addEventListener('jogada-feita', (e: Event) => {
            const detail = (e as CustomEvent).detail;
            // console.log('jogada feita evento');
            // console.log(detail.cartasRestantes);
            this.#cartasRestantes = detail.cartasRestantes;
            this.render();
        });
        
        this.render();
    }

    render() {
        //  console.log('Renderizando deck com:', this.#cartasRestantes, 'cartas');
        this.innerHTML = (`
        <div class="deck-container">
            <img class="deck-img" src="/src/assets/images/cards/0-costas.png">
            <h4>${this.#cartasRestantes}/52</h4>
        </div>
    `)
    }
}
customElements.define('game-deck', Deck);