import "./HandContainer.css";

export default class HandContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = (`
    <div class="card-hand">
        <slot></slot>
    </div>
         `);
  }
}
customElements.define('hand-container', HandContainer);
