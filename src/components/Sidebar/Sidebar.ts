import "./Sidebar.css";
import { combinations } from '../../assets/cards/combinations_info';
import sendEvent from '../../lib/sendEvent.ts'

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
  #metaAtual: number = 100;
  #maiorPontuacao: number = 0;

  rodadaAtual: RodadaAtualTipo = {
    pontuacaoTotal: 0,
    maosRestantes: 4,
    descartesRestantes: 3
  };

  jogadaAtual: JogadaAtualTipo = {
    chips: 0,
    mult: 0
  }

  #combinacaoAtual: { combinacao: keyof typeof combinations; cartas: any[] } | null = null;

  constructor() {
    super();
    const maiorPontuacaoSalva = localStorage.getItem('maiorPontuacao');
    if (maiorPontuacaoSalva) {
      this.#maiorPontuacao = parseInt(maiorPontuacaoSalva, 10);
    }
  }

  connectedCallback() {
    this.render();
    this.#adicionarEventListeners();
  }

  get metaAtual(): number {
    return this.#metaAtual;
  }

  set metaAtual(novaMeta: number) {
    this.#metaAtual = novaMeta;
    this.render();
  }

  #adicionarEventListeners() {
    document.addEventListener('combinacao-alterada', (e: any) => {
      this.#combinacaoAtual = e.detail.combinacao;

      this.jogadaAtual.chips = this.#combinacaoAtual ? combinations[this.#combinacaoAtual.combinacao]?.chips : 0;
      this.jogadaAtual.mult = this.#combinacaoAtual ? combinations[this.#combinacaoAtual.combinacao]?.mult : 0;

      const combinationName = this.querySelector('.combinations-header h3');
      const chipsValue = this.querySelector('.chips-value h3');
      const multiplierValue = this.querySelector('.multiplier-value h3');

      combinationName!.textContent = this.#combinacaoAtual?.combinacao ? combinations[this.#combinacaoAtual.combinacao]?.display_name : '';
      chipsValue!.textContent = this.jogadaAtual.chips.toString();
      multiplierValue!.textContent = this.jogadaAtual.mult.toString();
    });

    document.addEventListener('add-chips', (e: any) => {
      this.jogadaAtual.chips += e.detail.quantidade;
      const chipsDisplay = this.querySelector('.chips-value h3');

      if (chipsDisplay) {
        chipsDisplay.textContent = this.jogadaAtual.chips.toString();
        chipsDisplay.classList.add('info-highlight');

        setTimeout(() => {
          chipsDisplay.classList.remove('info-highlight');
        }, 300);
      }
    });

    document.addEventListener('add-pontos', (e: any) => {
      const pontuacaoTotalElemento = this.querySelector('.current-score-value h3');
      const combinacaoElemento = this.querySelector('.combinations-header h3');
      const maiorPontuacaoElemento = this.querySelector('#maiorPontuacao');

      const pontuacaoAtual = this.rodadaAtual.pontuacaoTotal;
      const pontuacaoObtidaJogada = this.jogadaAtual.chips * this.jogadaAtual.mult
      const novaPontuacao = pontuacaoAtual + (pontuacaoObtidaJogada);

      combinacaoElemento!.textContent = (pontuacaoObtidaJogada).toString();
      const incremento = Math.max(1, Math.floor((novaPontuacao - pontuacaoAtual) / 20)); // Incremento adaptativo

      if (novaPontuacao > pontuacaoAtual) {
        let contador = pontuacaoAtual;
        const intervalo = setInterval(() => {
          contador = Math.min(contador + incremento, novaPontuacao); // Garante que não ultrapasse
          if (pontuacaoTotalElemento) {
            pontuacaoTotalElemento.textContent = contador.toString();
            combinacaoElemento!.textContent = (pontuacaoObtidaJogada - (contador - pontuacaoAtual)).toString();
          }

          if (contador >= novaPontuacao) {
            clearInterval(intervalo);
          }
        }, 50);
      }
      this.rodadaAtual.pontuacaoTotal = novaPontuacao;

      const animationDuration = (50 * Math.min(20, Math.ceil((novaPontuacao - pontuacaoAtual) / incremento))); // calcula o tempo real da animacao

      setTimeout(() => {
        this.#combinacaoAtual!.cartas = [];
        this.#combinacaoAtual!.combinacao = 'nenhuma';

        this.jogadaAtual = {
          chips: 0,
          mult: 0
        }

        const pontuacaoTotalElemento = this.querySelector('.current-score-value h3');
        if (pontuacaoTotalElemento) {
          pontuacaoTotalElemento.textContent = this.rodadaAtual.pontuacaoTotal.toString();
        }

        const combinationName = this.querySelector('.combinations-header h3');
        const chipsValue = this.querySelector('.chips-value h3');
        const multiplierValue = this.querySelector('.multiplier-value h3');
        
        if (combinationName) combinationName.textContent = '';
        if (chipsValue) chipsValue.textContent = '0';
        if (multiplierValue) multiplierValue.textContent = '0';


        if (this.rodadaAtual.pontuacaoTotal >= this.#metaAtual) { // ganhou a rodada
          sendEvent(this, 'pontos-obtidos', {
            pontosFeitos: this.rodadaAtual.pontuacaoTotal,
            metaUltrapassada: this.#metaAtual,
            proximaMeta: this.metaAtual + 100
          })
        } else if (this.rodadaAtual.maosRestantes <= 0) {
          sendEvent(this, 'game-over', {})
        }
        if (this.rodadaAtual.pontuacaoTotal > this.#maiorPontuacao) {
          this.#maiorPontuacao = this.rodadaAtual.pontuacaoTotal;
          localStorage.setItem('maiorPontuacao', this.#maiorPontuacao.toString());
        }
        
        maiorPontuacaoElemento!.textContent = this.#maiorPontuacao.toString();

      }, Math.max(animationDuration, 1500)); // usa o tempo de animacao ou o tempo minimo de 1500
    });

    document.addEventListener('descarte-feito', () => {
      const combinationName = this.querySelector('.combinations-header h3');
      this.#combinacaoAtual = { combinacao: 'nenhuma', cartas: [] };

      this.rodadaAtual.descartesRestantes--;
      const discardDisplay = this.querySelector('.discards-info h2');

      discardDisplay!.textContent = (this.rodadaAtual.descartesRestantes).toString();
      discardDisplay!.classList.add('info-highlight');

      setTimeout(() => {
        discardDisplay!.classList.remove('info-highlight');
      }, 300);

      combinationName!.textContent = '';
    });

    document.addEventListener('descarte-negado', () => {
      const discardDisplay = this.querySelector('.discards-info h2');

      discardDisplay!.textContent = (this.rodadaAtual.descartesRestantes).toString();
      discardDisplay!.classList.add('info-highlight-negative');

      setTimeout(() => {
        discardDisplay!.classList.remove('info-highlight-negative');
      }, 300);

    });

    document.addEventListener('jogada-feita', () => {
      this.rodadaAtual.maosRestantes--;
      const handsDisplay = this.querySelector('.hands-info h2');

      handsDisplay!.textContent = (this.rodadaAtual.maosRestantes).toString();
      handsDisplay!.classList.add('info-highlight');

      setTimeout(() => {
        handsDisplay!.classList.remove('info-highlight');
      }, 300);
    })

    document.addEventListener('proximo-nivel', () => {
      this.#metaAtual += 100;
      this.rodadaAtual = {
        pontuacaoTotal: 0,
        maosRestantes: 4,
        descartesRestantes: 3
      };
      this.render();
    })
  }

  render() {
    this.innerHTML = (`
    <div class="sidebar-container">
      <div class="sidebar-header">
        <h2>ICElatro</h2>
      </div>
      <div class="score-goal">
       <div>
        <img src="/assets/images/misc/one-real.png" alt="Descrição da imagem" class="one-real">
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
          <h3>${this.rodadaAtual.pontuacaoTotal}</h3>
        </div>
      </div>

      <div class="combinations-container">
        <div class="combinations-header">
          <h3>${this.#combinacaoAtual?.combinacao ? combinations[this.#combinacaoAtual.combinacao]?.display_name : ''} </h3>
        </div>
        <div class="chips-multiplier">
          <div class="chips-value">
            <h3>${this.jogadaAtual.chips}</h3>
          </div>
          <h2>x</h2>
          <div class="multiplier-value">
            <h3>${this.jogadaAtual.mult}</h3>
          </div>
        </div>
      </div>
      <div class="game-info">        
        <div class="hands-info">
          <h3>Mãos</h3>
          <h2>${this.rodadaAtual.maosRestantes}</h2>
        </div>
        <div class="discards-info">
          <h3>Descartes</h3>
          <h2>${this.rodadaAtual.descartesRestantes}</h2>
        </div>
      </div>
      <h2 id="maiorPontuacaoDesc">Maior pontuação:<span id='maiorPontuacao'>${this.#maiorPontuacao}</span></h2>
    </div>
  `);
  }
}
customElements.define('app-sidebar', Sidebar);
