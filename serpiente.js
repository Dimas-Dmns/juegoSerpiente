
    // 1. Capturamos el canvas y su contexto de dibujo
    const canvas = document.getElementById("canvasJuego");
    const ctx = canvas.getContext("2d");
    const TAMANIO_CELDA = 25;

    

    // Primera pintura del juego al cargar la página
 function dibujarTodo() {
    limpiarCanvas();
    dibujarTablero();

    pintarParte(5, 5);
}

    // =========================
    // FUNCIONES DE DIBUJO
    // =========================

    function limpiarCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function dibujarTodo() {
      limpiarCanvas();
      dibujarTablero();
    }

function dibujarTablero() {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1;

    ctx.beginPath();

    // Líneas verticales
    for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    // Líneas horizontales
    for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();
}

function pintarParte(lineaX, lineaY) {
    let x = lineaX * TAMANIO_CELDA;
    let y = lineaY * TAMANIO_CELDA;

    ctx.fillStyle = "red";

    ctx.fillRect(
        x,
        y,
        TAMANIO_CELDA,
        TAMANIO_CELDA
    );
}



