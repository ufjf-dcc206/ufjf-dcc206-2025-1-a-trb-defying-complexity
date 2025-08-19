import './Card.css';
import { cardsObj } from '../../assets/cards/cards_object';

export interface CardType {
    id: string;
    selecionada: boolean;
    [key: string]: any;
}

export default class Card extends HTMLElement {
    #card: CardType = { id: '', selecionada: false };

    static get observedAttributes() {
        return ['carta', 'selecionada'];
    }

    constructor() {
        super();
    }

    set card(value: string) {
        this.#card = cardsObj.find(card => card.id === value) || { 
            id: '', 
            selecionada: false, 
            naipe: '', 
            valor: '', 
            cor: '', 
            img: '/assets/images/cards/0-costas.png', 
            valorJogo: 0 
        };
        this.#card.selecionada = this.hasAttribute('selecionada') || false;
    }


    get card(): string {
        return this.#card.id || '';
    }

    get cardData(): CardType {
        return { ...this.#card };
    }

    connectedCallback() {
        // Aguardar um tick para garantir que o cardsObj foi carregado
        setTimeout(() => {
            this.render();
        }, 0);
    }


    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'carta') {
            this.card = newValue;
            this.render();
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
        const imgSrc = this.#card.img || '/assets/images/cards/0-costas.png';
        this.innerHTML = `
            <div class="card-container ${this.#card.selecionada ? 'selected-card' : ''}" >
                <img class='card' src="${imgSrc}" alt="Carta ${this.#card.id}">
            </div>
        `;
    }
}
customElements.define('game-card', Card);