const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

const TAMANIO_CELDA = 25;

// ========================================
// VARIABLES GLOBALES
// ========================================

let serpiente = [
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
    { x: 2, y: 10 },
    { x: 1, y: 10 }
];

let direccionActual = "derecha";
let intervaloSerpiente = null;
let comida = { x: 10, y: 10 };
let puntaje = 0;
let juegoIniciado = false;


function limpiarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTablero() {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();
}

function pintarParte(lineaX, lineaY, color = "red") {
    let x = lineaX * TAMANIO_CELDA;
    let y = lineaY * TAMANIO_CELDA;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, TAMANIO_CELDA, TAMANIO_CELDA);

    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, TAMANIO_CELDA, TAMANIO_CELDA);
}

function pintarSerpiente() {
    for (let i = 0; i < serpiente.length; i++) {
        let parte = serpiente[i];
        if (i === 0) {
            pintarParte(parte.x, parte.y, "yellow");
        } else {
            pintarParte(parte.x, parte.y, "red");
        }
    }
}

// ========================================
// PARTE 1 y 3 – MOVIMIENTO EN 4 DIRECCIONES
// ========================================

function moverDerecha() {
    let cabeza = serpiente[0];
    let nuevaCabeza = { x: cabeza.x + 1, y: cabeza.y };
    serpiente.unshift(nuevaCabeza);
}

function moverIzquierda() {
    let cabeza = serpiente[0];
    let nuevaCabeza = { x: cabeza.x - 1, y: cabeza.y };
    serpiente.unshift(nuevaCabeza);
}

function moverArriba() {
    let cabeza = serpiente[0];
    let nuevaCabeza = { x: cabeza.x, y: cabeza.y - 1 };
    serpiente.unshift(nuevaCabeza);
}

function moverAbajo() {
    let cabeza = serpiente[0];
    let nuevaCabeza = { x: cabeza.x, y: cabeza.y + 1 };
    serpiente.unshift(nuevaCabeza);
}

// ========================================
// PARTE 2 y 7 – CAMBIO DE DIRECCIÓN
// ========================================

function cambiarDireccion(direccion) {
    if (direccion === "derecha" && direccionActual !== "izquierda") {
        direccionActual = "derecha";
    } else if (direccion === "izquierda" && direccionActual !== "derecha") {
        direccionActual = "izquierda";
    } else if (direccion === "arriba" && direccionActual !== "abajo") {
        direccionActual = "arriba";
    } else if (direccion === "abajo" && direccionActual !== "arriba") {
        direccionActual = "abajo";
    }
}

// ========================================
// PARTE 8 – COMIDA
// ========================================

function pintarComida() {
    pintarParte(comida.x, comida.y, "#22c55e");
}

function generarComida() {
    let columnas = canvas.width / TAMANIO_CELDA;
    let filas = canvas.height / TAMANIO_CELDA;

    comida.x = Math.floor(Math.random() * columnas);
    comida.y = Math.floor(Math.random() * filas);
}

// ========================================
// PARTE 9 – DETECTAR COLISIÓN CON COMIDA
// ========================================

function atrapaComida() {
    let cabeza = serpiente[0];
    return cabeza.x === comida.x && cabeza.y === comida.y;
}

// ========================================
// PARTE 5 y 7 – MOVER SERPIENTE AUTOMÁTICAMENTE
// ========================================

function moverSerpiente() {
    if (direccionActual === "derecha") {
        moverDerecha();
    } else if (direccionActual === "izquierda") {
        moverIzquierda();
    } else if (direccionActual === "arriba") {
        moverArriba();
    } else if (direccionActual === "abajo") {
        moverAbajo();
    }

    if (atrapaComida()) {
        puntaje++;
        document.getElementById("puntaje").textContent = puntaje;

        generarComida();

    } else {
        serpiente.pop();
    }

    dibujarTodo();
}

// ========================================
// PARTE 4, 5 y 6 – INICIAR / PAUSAR
// ========================================

function iniciarJuego() {
    if (juegoIniciado) return;

    juegoIniciado = true;
    document.getElementById("estado").textContent = "Jugando";
    document.getElementById("mensaje").textContent = "¡La serpiente se está moviendo!";

    intervaloSerpiente = setInterval(moverSerpiente, 150); // velocidad del juego
}

function pausarJuego() {
    clearInterval(intervaloSerpiente);
    juegoIniciado = false;
    document.getElementById("estado").textContent = "Pausado";
    document.getElementById("mensaje").textContent = "Juego pausado. Presiona Iniciar para continuar.";
}

// ========================================
// REINICIAR JUEGO
// ========================================

function reiniciarJuego() {
    clearInterval(intervaloSerpiente);
    juegoIniciado = false;

    serpiente = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 },
        { x: 2, y: 10 },
        { x: 1, y: 10 }
    ];

    direccionActual = "derecha";
    puntaje = 0;
    document.getElementById("puntaje").textContent = "0";
    document.getElementById("estado").textContent = "Listo";
    document.getElementById("mensaje").textContent = "Presiona iniciar para comenzar.";

    generarComida();
    dibujarTodo();
}

// ========================================
// DIBUJAR TODO
// ========================================

function dibujarTodo() {
    limpiarCanvas();
    dibujarTablero();
    pintarComida();
    pintarSerpiente();
}

// ========================================
// INICIO
// ========================================

generarComida();
dibujarTodo();