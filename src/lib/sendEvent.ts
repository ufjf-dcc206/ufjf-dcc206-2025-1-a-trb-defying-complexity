export default function enviarEvento(target: EventTarget, nome: string, body: object) {
    const evento = new CustomEvent(nome, {
        detail: body,
        bubbles: true // 🫧🫧
    });
    target.dispatchEvent(evento);
}
