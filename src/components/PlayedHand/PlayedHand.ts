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
            this.#renderAnimado();


        });
    }

    #renderAnimado() {
        this.innerHTML = '<div class="played-hand-container"></div>';
        const container = this.querySelector('.played-hand-container');

        this.#cartasJogadasAtual.forEach((el, index) => {
            setTimeout(() => {
                const isCardCombined = this.#cartasCombinadasAtual.some(combinedCard => combinedCard.id === el.id);

                const cardHtml = `
                <div class="played-card">
                <game-card carta="${el.id}"></game-card>
                ${isCardCombined ? `<div class="card-bonus">+${el.valorJogo || 0} fichas</div>` : ''}
                </div>
            `;

                container!.innerHTML += cardHtml;

                const novaCard = container!.lastElementChild as HTMLElement;
                setTimeout(() => {
                    novaCard.classList.add('animate-in');

                    // Se tem bonus, mostra depois de um tempinho
                    if (isCardCombined) {
                        setTimeout(() => {
                            const bonus = novaCard.querySelector('.card-bonus');
                            if (bonus) {
                                bonus.classList.add('show');
                                sendEvent(this, "add-chips", {
                                    quantidade: el.valorJogo
                                })
                            }
                        }, 200);
                    }
                }, 50);

                // se for a última, enviar depois de terminar as animações
                if (index === this.#cartasJogadasAtual.length - 1) {
                    setTimeout(() => {
                        sendEvent(this, "add-pontos", {});
                    }, 1000);
                }
            }, index * 500);
        });

        // limpar dps de 2 segundos
        setTimeout(() => {
            const allPlayedCards = container?.querySelectorAll('.played-card') || [];
            allPlayedCards.forEach(card => {
                (card as HTMLElement).classList.add('animate-out');
            });
            
            setTimeout(() => {
                if (container) container.innerHTML = '';
            }, 500);
        }, 2000);
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