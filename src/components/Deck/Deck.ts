import "./Deck.css";

export default class Deck extends HTMLElement {

    #cartasRestantes: number = 44;

    constructor() {
        super();
    }

    connectedCallback() {
        document.addEventListener('jogada-feita', (e: Event) => {
            const detail = (e as CustomEvent).detail;
            this.#cartasRestantes = detail.cartasRestantes;
            this.#atualizarContador();
        });

        document.addEventListener('proximo-nivel', () => {
            this.#cartasRestantes = 44;
            this.render();
        })
        this.render();
    }

    #atualizarContador() {
        const contador = this.querySelector('h4');
        if (contador) {
            contador.textContent = `${this.#cartasRestantes}/52`;
        }
    }




    render() {
        this.innerHTML = (`
        <div class="deck-container">
            <img class="deck-img" src="/assets/images/cards/0-costas.png">
            <h4>${this.#cartasRestantes}/52</h4>
        </div>
    `)
    }
}
customElements.define('game-deck', Deck);