import "./Sidebar.css";

export default class Sidebar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = (`
    <div class="sidebar-container">
      <div class="sidebar-header">
        <h2>SIDEBAR</h2>
      </div>
      <nav>
       
      </nav>
    </div>
  `);
  }
}
customElements.define('app-sidebar', Sidebar);
