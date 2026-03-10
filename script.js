// Constantes y estado inicial
const resolt = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

// Matriz de juego
let tauler = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

let moviments = 0;
const midaCasella = 100; // Mida en píxels (300/3)
let jugant = true;

// Inicialització al carregar
document.addEventListener("DOMContentLoaded", () => {
    crearPecesDOM();
    reiniciarJoc();
    
    document.getElementById("btn-reset").addEventListener("click", reiniciarJoc);
});

// Crea els elements div al DOM inicialment
function crearPecesDOM() {
    const contenidor = document.getElementById("tauler-puzle");
    contenidor.innerHTML = "";

    // Creem les 8 peces (l'espai 0 no té div)
    for (let i = 1; i <= 8; i++) {
        let div = document.createElement("div");
        div.className = "casella";
        div.id = `peca-${i}`;
        
        // Calculem quina part de la imatge de fons li toca a cada peça
        let filaOrig = Math.floor((i - 1) / 3);
        let colOrig = (i - 1) % 3;
        div.style.backgroundPosition = `-${colOrig * midaCasella}px -${filaOrig * midaCasella}px`;
        
        // Esdeveniment de clic (passem el valor de la peça en comptes de coordenades fixes per poder-la buscar)
        div.addEventListener("click", () => clicPeça(i));
        
        contenidor.appendChild(div);
    }
}

function reiniciarJoc() {
    // 1. Posem el tauler en estat resolt
    tauler = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0]
    ];
    
    // 2. Barregem fent moviments legals aleatoris (així garantim que es pot resoldre)
    for(let i = 0; i < 150; i++) {
        moureAleatori();
    }
    
    // 3. Reiniciem variables i UI
    moviments = 0;
    jugant = true;
    document.getElementById("comptador").innerText = moviments;
    document.getElementById("missatge-resolt").classList.add("ocult");
    
    // 4. Actualitzem el DOM visualment
    actualitzarDOM();
}

// Troba on és la casella buida (el 0)
function trobarBuit() {
    for (let f = 0; f < 3; f++) {
        for (let c = 0; c < 3; c++) {
            if (tauler[f][c] === 0) {
                return { f, c };
            }
        }
    }
}

// Troba on és una peça concreta en el tauler actual
function trobarPeca(valor) {
    for (let f = 0; f < 3; f++) {
        for (let c = 0; c < 3; c++) {
            if (tauler[f][c] === valor) {
                return { f, c };
            }
        }
    }
}

// Lògica en clicar una peça
function clicPeça(valor) {
    if (!jugant) return;

    let peca = trobarPeca(valor);
    let buit = trobarBuit();

    // Comprovar si és adjacent al buit (Distància Manhattan == 1)
    let distFila = Math.abs(peca.f - buit.f);
    let distCol = Math.abs(peca.c - buit.c);

    if (distFila + distCol === 1) {
        // És adjacent, fem l'intercanvi a l'array
        tauler[buit.f][buit.c] = valor;
        tauler[peca.f][peca.c] = 0;

        // Sumem moviment i actualitzem DOM
        moviments++;
        document.getElementById("comptador").innerText = moviments;
        actualitzarDOM();

        // Comprovem si s'ha resolt
        comprovarVictoria();
    }
}

// Posiciona visualment les peces del DOM segons l'estat de l'array "tauler"
function actualitzarDOM() {
    for (let f = 0; f < 3; f++) {
        for (let c = 0; c < 3; c++) {
            let valor = tauler[f][c];
            if (valor !== 0) {
                let div = document.getElementById(`peca-${valor}`);
                // Movem el div amb transform (suau gràcies al CSS)
                div.style.transform = `translate(${c * midaCasella}px, ${f * midaCasella}px)`;
            }
        }
    }
}

// Mou una peça a l'atzar de les que toquen al buit (usat per barrejar)
function moureAleatori() {
    let buit = trobarBuit();
    let possibles = [];

    if (buit.f > 0) possibles.push({ f: buit.f - 1, c: buit.c }); // Amunt
    if (buit.f < 2) possibles.push({ f: buit.f + 1, c: buit.c }); // Avall
    if (buit.c > 0) possibles.push({ f: buit.f, c: buit.c - 1 }); // Esquerra
    if (buit.c < 2) possibles.push({ f: buit.f, c: buit.c + 1 }); // Dreta

    let mov = possibles[Math.floor(Math.random() * possibles.length)];
    
    // Intercanvi
    tauler[buit.f][buit.c] = tauler[mov.f][mov.c];
    tauler[mov.f][mov.c] = 0;
}

// Comprova si l'estat actual del tauler coincideix amb "resolt"
function comprovarVictoria() {
    let guanyat = true;
    for (let f = 0; f < 3; f++) {
        for (let c = 0; c < 3; c++) {
            if (tauler[f][c] !== resolt[f][c]) {
                guanyat = false;
                break;
            }
        }
    }

    if (guanyat) {
        jugant = false;
        document.getElementById("moviments-finals").innerText = moviments;
        document.getElementById("missatge-resolt").classList.remove("ocult");
    }
}