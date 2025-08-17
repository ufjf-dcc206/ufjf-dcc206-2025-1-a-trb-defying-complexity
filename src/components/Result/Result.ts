import './Result.css';
import sendEvent from '../../lib/sendEvent.ts'

export default class Result extends HTMLElement {

    #resultTitle: string = '';
    #resultMessage: string = '';
    #botaoAtual: string = '';
    #botaoAtualText: string = '';


    connectedCallback() {
        this.render();
        this.#adicionarEventListenersGlobais();
    }

    #adicionarEventListenersGlobais() {
        document.addEventListener('pontos-obtidos', (e: any) => {
            const metaUltrapassada = e.detail.metaUltrapassada;
            const pontosFeitos = e.detail.pontosFeitos;
            const proximaMeta = e.detail.proximaMeta;
            this.#resultTitle = 'Ganhou!';
            this.#resultMessage = `Você conseguiu passar de nível! \n Você fez ${pontosFeitos} de ${metaUltrapassada} pontos!! Próxima meta éh de ${proximaMeta} hein`;
            this.#botaoAtual = 'continuarBtn';
            this.#botaoAtualText = 'Próximo nível';
            this.render();
        });

        document.addEventListener('game-over', (e: any) => {
            this.#resultTitle = 'Perdeu!';
            this.#resultMessage = 'Que pena! você não conseguiu passar de nível!';
            this.#botaoAtual = 'restartBtn';
            this.#botaoAtualText = 'Recomeçar';
            this.render();
        });
    }

    #adicionarEventListenersBotoes() {
        const continuarBtn = this.querySelector("#continuarBtn");
        const restartBtn = this.querySelector("#restartBtn");

        continuarBtn?.addEventListener('click', () => {
            this.#resultTitle = '';
            this.#resultMessage = '';
            this.#botaoAtual = '';
            this.#botaoAtualText = '';

            sendEvent(document, 'proximo-nivel', {
                proximaMeta: 200
            })
            this.render();
        });

        restartBtn?.addEventListener('click', () => {
            location.reload();
        });
    }

    render() {
        this.innerHTML = `
            <div class="result-container">
                <h1 class="pulse-animation">${this.#resultTitle}</h1>
                <p>${this.#resultMessage}</p>
                 ${this.#botaoAtual ? `<button id="${this.#botaoAtual}">${this.#botaoAtualText}</button>` : ''}
            </div>
        `;
        
        this.#adicionarEventListenersBotoes();
    }
}
customElements.define('game-result', Result);