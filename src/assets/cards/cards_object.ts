const img_path = 'src/assets/images/cards/';

const naipes = [
    { nome: 'copas', cor: 'vermelho' },
    { nome: 'ouros', cor: 'vermelho' },
    { nome: 'paus', cor: 'preto' },
    { nome: 'espadas', cor: 'preto' }
];

const valores = [
    { simbolo: 'as', nome: 'as' },
    { simbolo: '2', nome: '2' },
    { simbolo: '3', nome: '3' },
    { simbolo: '4', nome: '4' },
    { simbolo: '5', nome: '5' },
    { simbolo: '6', nome: '6' },
    { simbolo: '7', nome: '7' },
    { simbolo: '8', nome: '8' },
    { simbolo: '9', nome: '9' },
    { simbolo: '10', nome: '10' },
    { simbolo: 'valete', nome: 'valete' },
    { simbolo: 'dama', nome: 'dama' },
    { simbolo: 'rei', nome: 'rei' }
];

export const cardsObj: Array<{
    naipe: string;
    valor: string;
    cor: string;
    img: string;
    id: string;
    valorJogo: number;
    selecionada: boolean;
}> = [];

// adiciona os coringas
// cardsObj.push({
//     naipe: 'coringa',
//     valor: 'coringa-vermelho',
//     cor: 'vermelho',
//     img: `${img_path}coringa-vermelho.png`,
//     id: 'coringa-vermelho',
//     valorJogo: 0
// });

// cardsObj.push({
//     naipe: 'coringa',
//     valor: 'coringa-preto',
//     cor: 'preto',
//     img: `${img_path}coringa-preto.png`,
//     id: 'coringa-preto',
//     valorJogo: 0
// });

for (const naipe of naipes) {
    for (const valor of valores) {
        let valorJogo = 0;
        if (valor.simbolo === 'as') valorJogo = 11;
        else if (valor.simbolo === 'valete') valorJogo = 10;
        else if (valor.simbolo === 'dama') valorJogo = 10;
        else if (valor.simbolo === 'rei') valorJogo = 10;
        else valorJogo = Number(valor.simbolo);
        cardsObj.push({
            naipe: naipe.nome,
            valor: valor.simbolo,
            cor: naipe.cor,
            img: `${img_path}${valor.nome}-${naipe.nome}.png`,
            id: `${valor.nome}-${naipe.nome}`,
            valorJogo,
            selecionada: false
        });
    }
}