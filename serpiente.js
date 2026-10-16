const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

const TAMANIO_CELDA = 25;


// ========================================
// 2. ARREGLO DE LA SERPIENTE
// El primer objeto representa la cabeza
// ========================================

const serpiente = [
    { x: 0, y: 10 },
    { x: 0, y: 11 },
    { x: 0, y: 12 },
    { x: 0, y: 13 },
    { x: 0, y: 14 }
];

// ========================================
// PARTE 1 y 3 – MOVIMIENTO EN 4 DIRECCIONES
// ========================================

function moverDerecha() {
    let cabeza = serpiente[0];
    let nuevaCabeza = { x: cabeza.x + 1, y: cabeza.y };
    serpiente.unshift(nuevaCabeza);
    // No hacemos pop aquí todavía (lo controlamos en moverSerpiente)
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
    // Evitar que la serpiente se dé la vuelta sobre sí misma
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
// PARTE 4, 5 y 6 – INICIAR / PAUSAR
// ========================================

function iniciarJuego() {
    if (juegoIniciado) return; // evitar varios intervalos

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
// 3. LIMPIAR EL CANVAS
// ========================================

function limpiarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// ========================================
// 4. DIBUJAR LA CUADRÍCULA
// ========================================

function dibujarTablero() {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1;

    ctx.beginPath();

    // Líneas verticales
    for (
        let x = 0;
        x <= canvas.width;
        x += TAMANIO_CELDA
    ) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    // Líneas horizontales
    for (
        let y = 0;
        y <= canvas.height;
        y += TAMANIO_CELDA
    ) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();
}


// ========================================
// 5. PINTAR UNA PARTE DE LA SERPIENTE
// ========================================

function pintarParte(lineaX, lineaY, color = "red") {
    let x = lineaX * TAMANIO_CELDA;
    let y = lineaY * TAMANIO_CELDA;

    ctx.fillStyle = color;
    ctx.fillRect(
        x,
        y,
        TAMANIO_CELDA,
        TAMANIO_CELDA
    );

    ctx.strokeStyle = "black";
    ctx.strokeRect(
        x,
        y,
        TAMANIO_CELDA,
        TAMANIO_CELDA
    );
}


// ========================================
// 6. PINTAR LA SERPIENTE
// ========================================

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
// 7. FUNCIÓN PRINCIPAL DE DIBUJO
// ========================================

function dibujarTodo() {
    limpiarCanvas();
    dibujarTablero();
    pintarSerpiente();
}


// ========================================
// 8. DIBUJO INICIAL
// ========================================

dibujarTodo();