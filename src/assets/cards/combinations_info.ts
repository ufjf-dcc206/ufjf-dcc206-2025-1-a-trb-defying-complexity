const combinations = {
    straight_flush: {
        display_name: "Straight Flush",
        description: "5 cartas em sequência do mesmo naipe",
        chips: 100,
        mult: 8
    },
    quadra: {
        display_name: "Quadra",
        description: "4 cartas do mesmo valor",
        chips: 60,
        mult: 7
    },
    full_house: {
        display_name: "Full House",
        description: "3 cartas de um valor + 2 cartas de outro valor",
        chips: 40,
        mult: 4
    },
    flush: {
        display_name: "Flush",
        description: "5 cartas do mesmo naipe",
        chips: 35,
        mult: 4
    },
    sequencia: {
        display_name: "Sequência",
        description: "5 cartas em sequência",
        chips: 30,
        mult: 4
    },
    trinca: {
        display_name: "Trinca",
        description: "3 cartas do mesmo valor",
        chips: 30,
        mult: 3
    },
    dois_pares: {
        display_name: "Dois Pares",
        description: "2 pares diferentes",
        chips: 20,
        mult: 2
    },
    par: {
        display_name: "Par",
        description: "2 cartas do mesmo valor",
        chips: 10,
        mult: 2
    },
    carta_alta: {
        display_name: "Carta Alta",
        description: "Nenhuma combinação especial",
        chips: 5,
        mult: 1
    },
    nenhuma: {
        display_name: "Nenhum",
        description: "Nenhuma carta selecionada",
        chips: 0,
        mult: 0
    }
};

export { combinations };

