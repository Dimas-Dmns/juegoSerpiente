
    // 1. Capturamos el canvas y su contexto de dibujo
    const canvas = document.getElementById("canvasJuego");
    const ctx = canvas.getContext("2d");
    const TAMANIO_CELDA = 25;

    

    // Primera pintura del juego al cargar la página
    dibujarTodo();

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

    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo(500, 500);

    ctx.moveTo(250, 0);
    ctx.lineTo(250, 500);

    ctx.moveTo(0, 250);
    ctx.lineTo(500, 250);

    ctx.moveTo(500,0);
    ctx.lineTo(0, 500);



    ctx.stroke();
}



