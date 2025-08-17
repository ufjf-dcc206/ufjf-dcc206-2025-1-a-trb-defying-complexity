import "./PlayedHand.css";
import sendEvent from '../../lib/sendEvent.ts'
import type { CardType } from '../Card/Card.ts';

export default class PlayedHand extends HTMLElement {

    #cartasJogadasAtual: CardType[] = [];
    #cartasCombinadasAtual: CardType[] = [];

    #adicionarEventListeners() {
        document.addEventListener('jogada-feita', (e: any) => {
            this.#cartasJogadasAtual = e.detail.cartasSelecionadas;
            this.#cartasCombinadasAtual = e.detail.cartasCombinadas;
            sendEvent(this, 'toggle-btns-status', { disabled: true })
            this.#renderAnimado();
        });
    }

    #renderAnimado() {
        this.innerHTML = '<div class="played-hand-container"></div>';
        const container = this.querySelector('.played-hand-container');
        
        const animateCards = async () => {
            for (let index = 0; index < this.#cartasJogadasAtual.length; index++) {
                const el = this.#cartasJogadasAtual[index];
                const isCardCombined = this.#cartasCombinadasAtual.some(combinedCard => combinedCard.id === el.id);
                
                const cardHtml = `
                    <div class="played-card">
                        <game-card carta="${el.id}"></game-card>
                        ${isCardCombined ? `<div class="card-bonus">+${el.valorJogo || 0} fichas</div>` : ''}
                    </div>
                `;
                
                container!.innerHTML += cardHtml;
                const novaCard = container!.lastElementChild as HTMLElement;
                
                await new Promise(resolve => setTimeout(resolve, 50));
                novaCard.classList.add('animate-in');
                
                if (isCardCombined) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    const bonus = novaCard.querySelector('.card-bonus');
                    if (bonus) {
                        bonus.classList.add('show');
                        sendEvent(this, "add-chips", {
                            quantidade: el.valorJogo
                        });
                    }
                }
                
                if (index < this.#cartasJogadasAtual.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 250));
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            sendEvent(this, "add-pontos", {});
            this.#cartasJogadasAtual = [];
            this.#cartasCombinadasAtual = [];
            
            await new Promise(resolve => setTimeout(resolve, 500));
            sendEvent(this, 'toggle-btns-status', { disabled: false });
            
            await new Promise(resolve => setTimeout(resolve, 500));
            const allPlayedCards = container?.querySelectorAll('.played-card') || [];
            allPlayedCards.forEach(card => {
                (card as HTMLElement).classList.add('animate-out');
            });
            
            await new Promise(resolve => setTimeout(resolve, 500));
            if (container) container.innerHTML = '';
        };
        
        animateCards();
    }

    connectedCallback() {
        this.render();
        this.#adicionarEventListeners();
    }

    render() {
        this.innerHTML = (`
        <div class="played-hand-container">
            ${this.#cartasJogadasAtual.map((el) => {
            const isCardCombined = this.#cartasCombinadasAtual.some(combinedCard => combinedCard.id === el.id);
            return `
                <div class="played-card">
                    <game-card carta="${el.id}"></game-card>
                    ${isCardCombined ? `<div class="card-bonus">+${el.valorJogo || 0} fichas</div>` : ''}
                </div>
            `;
        }).join('')}
        </div>
    `)
    }
}
customElements.define('played-hand', PlayedHand);