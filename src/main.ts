import './style.css'
import Card from './components/Card/Card';
import Sidebar from './components/Sidebar/Sidebar';
import CardHand from './components/CardHand/CardHand';
import Deck from './components/Deck/Deck';
import PlayedHand from './components/PlayedHand/PlayedHand';
import GameResult from './components/Result/Result';

import checkCombination from './lib/checkCombination';



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

const playTriggered = (): void => {
    const cartasComDados = getCartasSelecionadasComDados();

    if (cartasComDados.length == 0) {
        console.error('tem que ter pelo menos 1 selecionadar');
        return;
    }
}


