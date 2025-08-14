// import './assets/styles.css';
// import './components';  // importa o barrel que registra todos os custom elements

function main() {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <h1>Hello Vite + TypeScript!</h1>

  `;
}

main();

