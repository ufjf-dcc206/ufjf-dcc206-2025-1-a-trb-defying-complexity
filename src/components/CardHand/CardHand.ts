import "./CardHand.css";
import { cardsObj } from '../../assets/cards/cards_object';
import checkCombination from '../../lib/checkCombination.ts'
import type { CardType } from '../Card/Card.ts';
import sendEvent from '../../lib/sendEvent.ts'

export default class CardHand extends HTMLElement {
    #cartasAtuais: CardType[] = [];
    #baralhoAtual: CardType[] = [];
    #btnsDisabled: boolean = false;
    #isPaused: boolean = false;

    constructor() {
        super();
        const todasCartas = cardsObj.map(carta => ({
            ...carta,
            selecionada: false
        }));
        const cartasEmbaralhadas = this.#embaralhar([...todasCartas]);

        this.#cartasAtuais = cartasEmbaralhadas.slice(0, 8);
        this.#baralhoAtual = cartasEmbaralhadas.slice(8);
    }

    #embaralhar(array: CardType[]): CardType[] {
        const arrayEmbaralhado = [...array];
        for (let i = arrayEmbaralhado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayEmbaralhado[i], arrayEmbaralhado[j]] = [arrayEmbaralhado[j], arrayEmbaralhado[i]];
        }
        return arrayEmbaralhado;
    }

    #obterCartasAleatorias(quantidade: number): CardType[] {
        if (quantidade > this.#baralhoAtual.length) {
            quantidade = this.#baralhoAtual.length;
        }

        const cartasSelecionadas = this.#baralhoAtual.slice(0, quantidade);
        this.#baralhoAtual = this.#baralhoAtual.slice(quantidade);

        const idsCartasSelecionadas = cartasSelecionadas.map(carta => carta.id);
        this.#baralhoAtual = this.#baralhoAtual.filter(carta => !idsCartasSelecionadas.includes(carta.id));

        return cartasSelecionadas;
    }

    organizar(ordem: string) {
        if (ordem === 'naipe') {
            this.#cartasAtuais.sort((a, b) => {
                const [valorA, naipeA] = a.id.split('-');
                const [valorB, naipeB] = b.id.split('-');

                if (naipeA === naipeB) {
                    const ordemValores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'valete', 'dama', 'rei', 'as'];
                    const indexA = ordemValores.indexOf(valorA);
                    const indexB = ordemValores.indexOf(valorB);
                    return indexA - indexB;
                }

                const ordemNaipes = ['espadas', 'copas', 'paus', 'ouros'];
                const indexNaipeA = ordemNaipes.indexOf(naipeA);
                const indexNaipeB = ordemNaipes.indexOf(naipeB);
                return indexNaipeA - indexNaipeB;
            });

            this.render();
        } else if (ordem === 'valor') {
            this.#cartasAtuais.sort((a, b) => {
                const [valorA] = a.id.split('-');
                const [valorB] = b.id.split('-');

                const ordemValores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'valete', 'dama', 'rei', 'as'];
                const indexA = ordemValores.indexOf(valorA);
                const indexB = ordemValores.indexOf(valorB);
                return indexB - indexA;
            });

            this.render();
        }
    }

    connectedCallback() {
        this.render();
        this.#adicionarEventListenersGlobais();
    }

    #adicionarEventListenersGlobais() {
        document.addEventListener('toggle-btns-status', (e: any) => {
            this.#btnsDisabled = e.detail.disabled;
            this.render();
        })

        document.addEventListener('pontos-obtidos', (e: any) => {
            this.#isPaused = true;
            this.render();
        });

        document.addEventListener('game-over', (e: any) => {
            this.#isPaused = true;
            this.render();
        });

        document.addEventListener('proximo-nivel', () => {
            const todasCartas = Object.values(cardsObj).map(carta => ({
                ...carta,
                selecionada: false
            }));
            const cartasEmbaralhadas = this.#embaralhar([...todasCartas]);

            this.#cartasAtuais = cartasEmbaralhadas.slice(0, 8);
            this.#baralhoAtual = cartasEmbaralhadas.slice(8);
            this.#btnsDisabled = false;
            this.#isPaused = false;

            this.render();
        })
    }

    #adicionarEventListenersElementos() {
        const organizarNaipeBtn = this.querySelector("#orderBySuit");
        const organizarValorBtn = this.querySelector("#orderByValue");
        const jogarBtn = this.querySelector("#play-btn");
        const descartarBtn = this.querySelector("#discard-btn");

        let cards = this.querySelectorAll('game-card');

        organizarNaipeBtn?.addEventListener('click', () => {
            this.organizar('naipe');
        });

        organizarValorBtn?.addEventListener('click', () => {
            this.organizar('valor');
        });

        jogarBtn?.addEventListener('click', () => {
            const cartasComDados = getCartasSelecionadasComDados();
            const cartasSelecionadas = this.querySelectorAll('game-card[selecionada]');
            const cartasRestantes = this.#baralhoAtual.length - cartasSelecionadas.length;
            const combinacao = checkCombination(cartasComDados);

            sendEvent(this, "jogada-feita", {
                combinacao: combinacao.combinacao,
                cartasCombinadas: combinacao.cartas,
                cartasSelecionadas: cartasComDados,
                cartasRestantes: cartasRestantes
            })

            cartasSelecionadas.forEach(card => {
                card.removeAttribute('selecionada');
            });

            this.#cartasAtuais = this.#cartasAtuais.filter(carta => !carta.selecionada);

            this.#cartasAtuais.forEach(carta => {
                carta.selecionada = false;
            });

            const novasCartas = this.#obterCartasAleatorias(cartasSelecionadas.length);
            this.#cartasAtuais = this.#cartasAtuais.filter(carta => !carta.selecionada).concat(novasCartas);

            this.render();
        })

        descartarBtn?.addEventListener('click', () => {

            const cartasSelecionadas = this.querySelectorAll('game-card[selecionada]');
            // busca o Sidebar para verificar descartesRestantes
            const sidebar = document.querySelector('app-sidebar');
            let descartesRestantes = 0;
            if (sidebar && 'rodadaAtual' in sidebar) {
                descartesRestantes = (sidebar as any).rodadaAtual.descartesRestantes;
            }
            if (cartasSelecionadas.length > 0 && descartesRestantes > 0) {
                sendEvent(document, "descarte-feito", {});
                const idsSelecionadas = Array.from(cartasSelecionadas).map(card => card.getAttribute('carta'));
                this.#cartasAtuais = this.#cartasAtuais.filter(carta => !idsSelecionadas.includes(carta.id));
                const novasCartas = this.#obterCartasAleatorias(cartasSelecionadas.length);
                this.#cartasAtuais = this.#cartasAtuais.concat(novasCartas);
                this.render();
            } else if (descartesRestantes === 0) {
                sendEvent(document, "descarte-negado", {});
            }
        });

        const getCardInfo = (cardElement: any) => {
            return {
                element: cardElement,
                id: cardElement.card,
                ...cardElement.cardData
            };
        };

        const getCartasSelecionadasComDados = () => {
            const cartasSelecionadas = this.querySelectorAll('game-card[selecionada]');
            return Array.from(cartasSelecionadas).map(carta => getCardInfo(carta));
        };

        const selectCard = (e: Event): void => {
            const cardElement = e.currentTarget as HTMLElement;
            const cartaId = cardElement.getAttribute('carta');
            const quantSelecionado = this.querySelectorAll('game-card[selecionada]').length;


            const carta = this.#cartasAtuais.find(c => c.id === cartaId);
            if (!carta) return;
            if (cardElement.hasAttribute('selecionada')) {
                cardElement.removeAttribute('selecionada');
                carta.selecionada = false;
            } else {
                if (quantSelecionado == 5 || this.#isPaused) return;
                cardElement.setAttribute('selecionada', '');
                carta.selecionada = true;
            }

            const cartasComDados = getCartasSelecionadasComDados();

            const combinacao = checkCombination(cartasComDados);

            const evento = new CustomEvent('combinacao-alterada', {
                detail: {
                    combinacao: combinacao,
                    cartasSelecionadas: cartasComDados.length
                },
                bubbles: true
            });
            this.dispatchEvent(evento);
            this.render();
        }

        cards.forEach((el) => {
            el.addEventListener('click', selectCard);
        });
    }

    render() {
        this.innerHTML = (`
            <div class="card-hand">
                ${this.#cartasAtuais.map((el) => {
                    return `<game-card carta="${el.id}" ${el.selecionada ? "selecionada" : ""}></game-card>`
                }).join('')}
            </div>
            
            <div style="text-align: center;">
                <h4 style="margin: 10px 0;">${this.#cartasAtuais.length}/8</h4>
            </div>
            <div class="card-hand-controls">
                ${this.#cartasAtuais.some(carta => carta.selecionada) ? `<button id="play-btn" ${this.#btnsDisabled ? 'disabled' : ''}>Jogar mão</button>` : ''}
                <div class="card-hand-controls-group">
                    <h4>Organizar mão</h4>
                    <div>
                        <button class="order-btn" id="orderBySuit">Naipe</button>
                        <button class="order-btn" id="orderByValue">Valor</button>
                    </div>
                </div>
                ${this.#cartasAtuais.some(carta => carta.selecionada) ? `<button id="discard-btn" ${this.#btnsDisabled ? 'disabled' : ''}>Descartar</button>` : ''}
            </div>

      `);

        this.#adicionarEventListenersElementos();
    }
}

customElements.define('card-hand', CardHand);
