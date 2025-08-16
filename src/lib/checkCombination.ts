interface CardData {
    valor: string | number;
    naipe: string;
    element: HTMLElement;
    id: string;
}

function contarValores(cartas: CardData[]): Record<string | number, CardData[]> {
    // conta quantas cartas de cada tipo tem, tipo quantos reis, quandos 3...
    const contagem: Record<string | number, CardData[]> = {};
    for (const carta of cartas) {
        if (!contagem[carta.valor]) contagem[carta.valor] = [];
        contagem[carta.valor].push(carta);
    }
    return contagem;
}

function contarNaipes(cartas: CardData[]): Record<string, CardData[]> {
    const contagem: Record<string, CardData[]> = {};
    // conta quantas cartas de cada naipe tem...
    for (const carta of cartas) {
        if (!contagem[carta.naipe]) contagem[carta.naipe] = [];
        contagem[carta.naipe].push(carta);
    }
    return contagem;
}

function valorNumerico(valor: string): number {
    switch (valor) {
        case 'as': return 14;
        case 'rei': return 13;
        case 'dama': return 12;
        case 'valete': return 11;
        default: return Number(valor);
    }
}

function isSequencia(cartas: CardData[]): CardData[] | null {
    const valores = cartas.map(c => valorNumerico(c.valor as string));
    const valoresUnicos = Array.from(new Set(valores));
    valoresUnicos.sort((a, b) => a - b);

    for (let i = 1; i < valoresUnicos.length; i++) {
        if (valoresUnicos[i] !== valoresUnicos[i - 1] + 1) return null;
    }
    if (valoresUnicos.length !== cartas.length) return null;

    return cartas;
}

export default function checkCombination(selectedCards: CardData[]) {
    const quantCartasSelecionadas = selectedCards.length;
    if (quantCartasSelecionadas < 1) return { combinacao: "nenhuma", cartas: [] };
;

    // Ordena por valor numérico para facilitar sequências
    const cartas = [...selectedCards].sort((a, b) => valorNumerico(a.valor as string) - valorNumerico(b.valor as string));
    const contagemValores = contarValores(cartas);
    const contagemNaipes = contarNaipes(cartas);

    // STRAIGHT FLUSH: 5 cartas do mesmo naipe em sequência
    if (quantCartasSelecionadas === 5) {
        if (Object.keys(contagemNaipes).length === 1) {
            const seq = isSequencia(cartas);
            if (seq) {
                return { combinacao: "straight_flush", cartas: seq };
            }
        }
    }

    // QUADRA: 4 cartas do mesmo valor
    for (const valor in contagemValores) {
        if (contagemValores[valor].length === 4) {
            return { combinacao: "quadra", cartas: contagemValores[valor] };
        }
    }

    // FULL HOUSE: 3 cartas de um valor + 2 cartas de outro valor
    let trinca: CardData[] = [];
    let par: CardData[] = [];
    for (const valor in contagemValores) {
        if (contagemValores[valor].length === 3) trinca = contagemValores[valor];
        if (contagemValores[valor].length === 2) par = contagemValores[valor];
    }
    if (trinca.length && par.length && quantCartasSelecionadas === 5) {
        return { combinacao: "full_house", cartas: [...trinca, ...par] };
    }

    // FLUSH: 5 cartas do mesmo naipe
    if (quantCartasSelecionadas === 5 && Object.keys(contagemNaipes).length === 1) {
        return { combinacao: "flush", cartas };
    }

    // SEQUÊNCIA: 5 cartas em sequência, independente do naipe
    if (quantCartasSelecionadas === 5) {
        const seq = isSequencia(cartas);
        if (seq) {
            return { combinacao: "sequencia", cartas: seq };
        }
    }

    // TRINCA: 3 cartas do mesmo valor
    for (const valor in contagemValores) {
        if (contagemValores[valor].length === 3) {
            return { combinacao: "trinca", cartas: contagemValores[valor] };
        }
    }

    // DOIS PARES: 2 pares diferentes
    const pares = Object.values(contagemValores).filter(arr => arr.length === 2);
    if (pares.length === 2) {
        return { combinacao: "dois_pares", cartas: [...pares[0], ...pares[1]] };
    }

    // PAR: 2 cartas do mesmo valor
    if (pares.length === 1) {
        return { combinacao: "par", cartas: pares[0] };
    }

    // CARTA ALTA: nenhuma combinação
    return { combinacao: "carta_alta", cartas: [cartas[cartas.length - 1]] };
}