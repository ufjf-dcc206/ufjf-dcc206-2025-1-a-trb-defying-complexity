import './style.css'
import Sidebar from './components/Sidebar/Sidebar.js';
import Card from './components/Card/Card.js';

import checkCombination from './lib/checkCombination.js';

let cards = document.querySelectorAll('game-card');
let jogarBtn = document.querySelector("#jogarBtn");

const getCardInfo = (cardElement: any) => {
    return {
        element: cardElement,
        id: cardElement.card,
        ...cardElement.cardData
    };
};

const getCartasSelecionadasComDados = () => {
    const cartasSelecionadas = document.querySelectorAll('game-card[selecionada]');
    return Array.from(cartasSelecionadas).map(carta => getCardInfo(carta));
};

const selectCard = (e: Event): void => {
    const cardElement = e.currentTarget as HTMLElement;
    const quantSelecionado = document.querySelectorAll('game-card[selecionada]').length;

    if (cardElement.hasAttribute('selecionada')) {
        cardElement.removeAttribute('selecionada');
    } else {
        if (quantSelecionado == 5) return;
        cardElement.setAttribute('selecionada', '');
    }
}

const playTriggered = (): void => {
    const cartasComDados = getCartasSelecionadasComDados();

    if (cartasComDados.length == 0) {
        console.error('tem que ter pelo menos 1 selecionadar');
        return;
    }
    console.log(cartasComDados)
    checkCombination(cartasComDados);
}

cards.forEach((el) => {
    el.addEventListener('click', selectCard);
});

jogarBtn?.addEventListener('click', playTriggered)