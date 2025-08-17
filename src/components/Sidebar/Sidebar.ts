import "./Sidebar.css";
import { combinations } from '../../assets/cards/combinations_info';

interface RodadaAtualTipo {
  pontuacaoTotal: number;
  maosRestantes: number;
  descartesRestantes: number;
}

interface JogadaAtualTipo {
  chips: number;
  mult: number;
}

export default class Sidebar extends HTMLElement {
  #metaAtual: number = 1000;

  #rodadaAtual: RodadaAtualTipo = {
    pontuacaoTotal: 0,
    maosRestantes: 0,
    descartesRestantes: 0
  };

  #jogadaAtual: JogadaAtualTipo = {
    chips: 0,
    mult: 0
  }

  #combinacaoAtual: { combinacao: keyof typeof combinations; cartas: any[] } | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.#adicionarEventListeners();
  }

  #adicionarEventListeners() {
    document.addEventListener('combinacao-alterada', (e: any) => {
      this.#combinacaoAtual = e.detail.combinacao;

      this.#jogadaAtual.chips = this.#combinacaoAtual ? combinations[this.#combinacaoAtual.combinacao]?.chips : 0;
      this.#jogadaAtual.mult = this.#combinacaoAtual ? combinations[this.#combinacaoAtual.combinacao]?.mult : 0;

      const combinationName = this.querySelector('.combinations-header h3');
      const chipsValue = this.querySelector('.chips-value h3');
      const multiplierValue = this.querySelector('.multiplier-value h3');

      combinationName!.textContent = this.#combinacaoAtual?.combinacao ? combinations[this.#combinacaoAtual.combinacao]?.display_name : '';
      chipsValue!.textContent = this.#jogadaAtual.chips.toString();
      multiplierValue!.textContent = this.#jogadaAtual.mult.toString();
    });

    document.addEventListener('add-chips', (e: any) => {
      this.#jogadaAtual.chips += e.detail.quantidade;
      const chipsDisplay = this.querySelector('.chips-value h3');

      if (chipsDisplay) {
        chipsDisplay.textContent = this.#jogadaAtual.chips.toString();
        chipsDisplay.classList.add('chips-highlight');

        setTimeout(() => {
          chipsDisplay.classList.remove('chips-highlight');
        }, 300);
      }
    });

    document.addEventListener('add-pontos', (e: any) => {
      this.#rodadaAtual.pontuacaoTotal += (this.#jogadaAtual.chips * this.#jogadaAtual.mult);

      this.render();

      setTimeout(() => {
        this.#jogadaAtual = {
          chips: 0,
          mult: 0
        }
        this.render();

      }, 1000);
    });
  }

  render() {
    this.innerHTML = (`
    <div class="sidebar-container">
      <div class="sidebar-header">
        <h2>ICElatro</h2>
      </div>
      <div class="score-goal">
       <div>
        <img src="/src/assets/images/misc/one-real.png" alt="Descrição da imagem" class="one-real">
       </div>
       <div class="score-goal-info">
         <p>Pontue pelo menos</p>
         <h3>${this.#metaAtual} pontos</h3>
         <p>para ganhar <span style="color: rgba(225, 185, 54, 1); font-size: 1.2em;">$$$</span></p>
       </div>
      </div>
      <div class="current-score">
        <div class="current-score-info">
          <p>Pontos</p>
          <p>atuais</p>
        </div>
        <div class="current-score-value">
          <h3>${this.#rodadaAtual.pontuacaoTotal}</h3>
        </div>
      </div>

      <div class="combinations-container">
        <div class="combinations-header">
          <h3>${this.#combinacaoAtual?.combinacao ? combinations[this.#combinacaoAtual.combinacao]?.display_name : ''} </h3>
        </div>
        <div class="chips-multiplier">
          <div class="chips-value">
            <h3>${this.#jogadaAtual.chips}</h3>
          </div>
          <h2>x</h2>
          <div class="multiplier-value">
            <h3>${this.#jogadaAtual.mult}</h3>
          </div>
        </div>

    </div>
  `);
  }
}
customElements.define('app-sidebar', Sidebar);
