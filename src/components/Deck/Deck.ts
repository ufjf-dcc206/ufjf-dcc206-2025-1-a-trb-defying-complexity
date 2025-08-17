import "./Deck.css";

export default class Deck extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = (`
        <div class="deck-container">
            <img class="deck-img" src="/src/assets/images/cards/0-costas.png">
            <h4>44/52</h4>
        </div>
    `)}
}
customElements.define('game-deck', Deck);