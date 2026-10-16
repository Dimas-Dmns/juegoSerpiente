const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

const TAMANIO_CELDA = 25;


// ========================================
// 2. ARREGLO DE LA SERPIENTE
// El primer objeto representa la cabeza
// ========================================

const serpiente = [
    { x: 5, y: 9 },
    { x: 5, y: 8 },
    { x: 5, y: 7 },
    { x: 5, y: 6 },
    { x: 5, y: 5 }
];


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
    // Convertir coordenadas de celda a píxeles
    let x = lineaX * TAMANIO_CELDA;
    let y = lineaY * TAMANIO_CELDA;

    // Pintar el interior del cuadrado
    ctx.fillStyle = color;
    ctx.fillRect(
        x,
        y,
        TAMANIO_CELDA,
        TAMANIO_CELDA
    );

    // Pintar el borde del cuadrado
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

        // La primera parte es la cabeza
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