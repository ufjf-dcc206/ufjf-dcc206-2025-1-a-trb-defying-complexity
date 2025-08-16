import './Card.css';
import { cardsObj } from '../../assets/cards/cards_object';

interface CardType {
    id: string;
    [key: string]: any;
}

export default class Card extends HTMLElement {
    #card: CardType = { id: '' };

    static get observedAttributes() {
        return ['carta', 'selecionada'];
    }

    constructor() {
        super();
    }

    set card(value: string) {
        this.#card = cardsObj.find(card => card.id === value) || { id: '' };
        this.#card.selecionada = this.hasAttribute('selecionada') || false;
        this.render();
    }


    get card(): string {
        return this.#card.id || '';
    }

    get cardData(): CardType {
        return { ...this.#card };
    }

    connectedCallback() {
        this.render();
    }


    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'carta') {
            this.card = newValue;
        }

        if (name === 'selecionada') {
            this.#card.selecionada = (newValue !== null);
            
            const container = this.querySelector('.card-container');
            if (container) {
                if (this.#card.selecionada) {
                    container.classList.add('selected-card');
                } else {
                    container.classList.remove('selected-card');
                }
            }
        }
    }

    render() {
        this.innerHTML = `
            <div class="card-container ${this.#card.selecionada ? 'selected-card' : ''}" >
                <img class='card' src="${this.#card.img}">
            </div>
        `;
    }
}
customElements.define('game-card', Card);