const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

const TAMANIO_CELDA = 25;
const COLUMNAS = canvas.width / TAMANIO_CELDA;
const FILAS = canvas.height / TAMANIO_CELDA;
const VELOCIDAD_INICIAL = 300;
const COMIDAS_POR_NIVEL = 5;

let serpiente;
let manzana;
let direccion;
let siguienteDireccion;
let puntaje = 0;
let nivel = 1;
let velocidad = VELOCIDAD_INICIAL;
let gameOver = false;
let pausado = true;
let iniciado = false;
let intervaloJuego = null;
let intervaloReloj = null;
let segundos = 0;
let sonidoActivado = true;
let audioContext = null;

const elementoPuntaje = document.getElementById("puntaje");
const elementoNivel = document.getElementById("nivel");
const elementoTiempo = document.getElementById("tiempo");
const elementoEstado = document.getElementById("estado");
const capaMensaje = document.getElementById("mensaje");
const mensajeIcono = document.getElementById("mensajeIcono");
const mensajeEtiqueta = document.querySelector(".mensaje-etiqueta");
const mensajeTitulo = document.getElementById("mensajeTitulo");
const mensajeTexto = document.getElementById("mensajeTexto");
const botonPausa = document.getElementById("botonPausa");
const controlSonido = document.getElementById("sonidoActivado");

function crearSerpienteInicial() {
    return [
        { x: 9, y: 12 },
        { x: 8, y: 12 },
        { x: 7, y: 12 },
        { x: 6, y: 12 },
        { x: 5, y: 12 }
    ];
}

function iniciarEstadoInicial() {
    serpiente = crearSerpienteInicial();
    direccion = { x: 1, y: 0 };
    siguienteDireccion = { x: 1, y: 0 };
    manzana = crearManzana();
    puntaje = 0;
    nivel = 1;
    velocidad = VELOCIDAD_INICIAL;
    segundos = 0;
    gameOver = false;
    pausado = true;
    iniciado = false;
    actualizarMarcadores();
    dibujarEscenario();
    dibujarManzana();
    dibujarSerpiente();
    actualizarReloj();
}

function dibujarEscenario() {
    const gradiente = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradiente.addColorStop(0, "#1b3b27");
    gradiente.addColorStop(0.55, "#24482d");
    gradiente.addColorStop(1, "#152f20");
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Manchas suaves que sugieren musgo y luz filtrada entre árboles.
    for (let i = 0; i < 18; i++) {
        const x = (i * 137 + 31) % canvas.width;
        const y = (i * 211 + 47) % canvas.height;
        const radio = 18 + (i % 4) * 9;
        const luz = ctx.createRadialGradient(x, y, 1, x, y, radio);
        luz.addColorStop(0, "rgba(145, 163, 78, 0.10)");
        luz.addColorStop(1, "rgba(145, 163, 78, 0)");
        ctx.fillStyle = luz;
        ctx.beginPath();
        ctx.arc(x, y, radio, 0, Math.PI * 2);
        ctx.fill();
    }

    // Pequeños detalles de tierra, discretos para no entorpecer el juego.
    for (let i = 0; i < 85; i++) {
        const x = (i * 71 + 13) % canvas.width;
        const y = (i * 113 + 29) % canvas.height;
        ctx.fillStyle = i % 3 === 0
            ? "rgba(196, 164, 91, 0.10)"
            : "rgba(7, 22, 13, 0.13)";
        ctx.beginPath();
        ctx.ellipse(x, y, 1.5 + (i % 2), 1, (i % 5) * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Cuadrícula muy tenue: ayuda a leer las casillas sin parecer una hoja técnica.
    ctx.strokeStyle = "rgba(224, 218, 157, 0.075)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Borde cálido para delimitar con claridad el área jugable.
    ctx.strokeStyle = "rgba(222, 185, 89, 0.42)";
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, canvas.width - 3, canvas.height - 3);
}

function pintarParte(x, y, indice, esCabeza) {
    const px = x * TAMANIO_CELDA;
    const py = y * TAMANIO_CELDA;
    const margen = esCabeza ? 2 : 2.7;
    const tam = TAMANIO_CELDA - margen * 2;

    ctx.save();
    ctx.shadowColor = "rgba(4, 12, 6, 0.42)";
    ctx.shadowBlur = esCabeza ? 7 : 4;
    ctx.shadowOffsetY = 2;

    const gradiente = ctx.createLinearGradient(px, py, px + TAMANIO_CELDA, py + TAMANIO_CELDA);
    if (esCabeza) {
        gradiente.addColorStop(0, "#b9c96b");
        gradiente.addColorStop(0.45, "#658d3e");
        gradiente.addColorStop(1, "#294f2a");
    } else {
        gradiente.addColorStop(0, indice % 2 === 0 ? "#8eac4e" : "#789a43");
        gradiente.addColorStop(0.5, "#47763a");
        gradiente.addColorStop(1, "#254a2b");
    }

    ctx.fillStyle = gradiente;
    ctx.beginPath();
    ctx.roundRect(px + margen, py + margen, tam, tam, esCabeza ? 8 : 7);
    ctx.fill();
    ctx.restore();

    // Brillo lateral y pequeñas escamas para dar volumen a la piel.
    ctx.strokeStyle = "rgba(226, 237, 157, 0.40)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px + margen + 4, py + margen + 4);
    ctx.quadraticCurveTo(px + margen + 1, py + tam * 0.48, px + margen + 5, py + tam - 4);
    ctx.stroke();

    if (!esCabeza && indice % 2 === 0) {
        ctx.fillStyle = "rgba(24, 55, 29, 0.55)";
        ctx.beginPath();
        ctx.arc(px + TAMANIO_CELDA / 2, py + TAMANIO_CELDA / 2, 2.1, 0, Math.PI * 2);
        ctx.fill();
    }
}

function dibujarSerpiente() {
    // Se dibuja primero la cola y al final la cabeza.
    for (let i = serpiente.length - 1; i >= 0; i--) {
        pintarParte(serpiente[i].x, serpiente[i].y, i, i === 0);
    }
    dibujarOjos();
}

function dibujarOjos() {
    const cabeza = serpiente[0];
    const cx = cabeza.x * TAMANIO_CELDA + TAMANIO_CELDA / 2;
    const cy = cabeza.y * TAMANIO_CELDA + TAMANIO_CELDA / 2;
    let ojos = [];

    if (direccion.x === 1) ojos = [[cx + 4, cy - 5], [cx + 4, cy + 5]];
    else if (direccion.x === -1) ojos = [[cx - 4, cy - 5], [cx - 4, cy + 5]];
    else if (direccion.y === -1) ojos = [[cx - 5, cy - 4], [cx + 5, cy - 4]];
    else ojos = [[cx - 5, cy + 4], [cx + 5, cy + 4]];

    ojos.forEach(([x, y]) => {
        ctx.fillStyle = "#f7e8a5";
        ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#171d11";
        ctx.beginPath(); ctx.arc(x + direccion.x, y + direccion.y, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.85)";
        ctx.beginPath(); ctx.arc(x - 0.7, y - 0.8, 0.8, 0, Math.PI * 2); ctx.fill();
    });
}

function crearManzana() {
    let posicion;
    do {
        posicion = {
            x: Math.floor(Math.random() * COLUMNAS),
            y: Math.floor(Math.random() * FILAS)
        };
    } while (serpiente && serpiente.some(parte => parte.x === posicion.x && parte.y === posicion.y));
    return posicion;
}

function dibujarManzana() {
    const cx = manzana.x * TAMANIO_CELDA + TAMANIO_CELDA / 2;
    const cy = manzana.y * TAMANIO_CELDA + TAMANIO_CELDA / 2;

    ctx.save();
    ctx.shadowColor = "rgba(9, 10, 5, 0.5)";
    ctx.shadowBlur = 9;
    ctx.shadowOffsetY = 3;

    const rojo = ctx.createRadialGradient(cx - 5, cy - 6, 1, cx, cy, 12);
    rojo.addColorStop(0, "#ff6a55");
    rojo.addColorStop(0.38, "#ef233c");
    rojo.addColorStop(1, "#8e1023");
    ctx.fillStyle = rojo;
    ctx.beginPath();
    ctx.arc(cx - 3.2, cy + 1, 7.2, 0, Math.PI * 2);
    ctx.arc(cx + 3.2, cy + 1, 7.2, 0, Math.PI * 2);
    ctx.quadraticCurveTo(cx + 9, cy + 10, cx, cy + 10);
    ctx.quadraticCurveTo(cx - 9, cy + 10, cx - 6.5, cy + 4);
    ctx.fill();
    ctx.restore();

    // Tallo.
    ctx.strokeStyle = "#5a351b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx, cy - 5); ctx.quadraticCurveTo(cx + 1, cy - 10, cx + 4, cy - 11); ctx.stroke();

    // Hoja verde oliva.
    ctx.fillStyle = "#9bb64e";
    ctx.beginPath();
    ctx.ellipse(cx + 5, cy - 8, 4.2, 2.2, -0.55, 0, Math.PI * 2);
    ctx.fill();

    // Reflejo brillante.
    ctx.fillStyle = "rgba(255, 235, 207, 0.82)";
    ctx.beginPath(); ctx.ellipse(cx - 5, cy - 2, 2, 3.3, 0.35, 0, Math.PI * 2); ctx.fill();
}

function renderizar() {
    dibujarEscenario();
    dibujarManzana();
    dibujarSerpiente();
}

function limpiarTemporizadores() {
    if (intervaloJuego !== null) {
        clearInterval(intervaloJuego);
        intervaloJuego = null;
    }
    if (intervaloReloj !== null) {
        clearInterval(intervaloReloj);
        intervaloReloj = null;
    }
}

function iniciarJuego() {
    if (gameOver) {
        reiniciarJuego();
        return;
    }
    if (!pausado && iniciado) return;

    ocultarMensaje();
    pausado = false;
    iniciado = true;
    elementoEstado.textContent = "En marcha: ¡busca la manzana!";
    botonPausa.innerHTML = "Ⅱ <span>Pausar</span>";
    arrancarTemporizadores();
    reproducirSonido("inicio");
}

function arrancarTemporizadores() {
    if (intervaloJuego !== null) clearInterval(intervaloJuego);
    intervaloJuego = setInterval(moverSerpiente, velocidad);

    if (intervaloReloj === null) {
        intervaloReloj = setInterval(() => {
            if (!pausado && !gameOver) {
                segundos++;
                actualizarReloj();
            }
        }, 1000);
    }
}

function pausarJuego() {
    if (gameOver) return;

    if (!iniciado) {
        elementoEstado.textContent = "Pulsa Jugar para comenzar la partida.";
        return;
    }

    pausado = !pausado;
    if (pausado) {
        if (intervaloJuego !== null) clearInterval(intervaloJuego);
        intervaloJuego = null;
        botonPausa.innerHTML = "▶ <span>Continuar</span>";
        elementoEstado.textContent = "Partida en pausa";
        mostrarMensaje("Ⅱ", "PARTIDA EN PAUSA", "Tómate un respiro. Cuando quieras, continúa.", "Continuar partida", iniciarJuego);
    } else {
        ocultarMensaje();
        botonPausa.innerHTML = "Ⅱ <span>Pausar</span>";
        elementoEstado.textContent = "En marcha: ¡busca la manzana!";
        arrancarTemporizadores();
    }
}

function reiniciarJuego() {
    limpiarTemporizadores();
    iniciarEstadoInicial();
    mostrarMensaje("🐍", "EL BOSQUE TE ESPERA", "Come la manzana roja. No choques con los bordes ni contigo mismo.", "Comenzar partida", iniciarJuego);
    elementoEstado.textContent = "Partida reiniciada";
    botonPausa.innerHTML = "Ⅱ <span>Pausar</span>";
}

function moverSerpiente() {
    if (pausado || gameOver) return;

    direccion = { ...siguienteDireccion };
    const cabezaActual = serpiente[0];
    const nuevaCabeza = {
        x: cabezaActual.x + direccion.x,
        y: cabezaActual.y + direccion.y
    };

    if (nuevaCabeza.x < 0 || nuevaCabeza.x >= COLUMNAS ||
        nuevaCabeza.y < 0 || nuevaCabeza.y >= FILAS) {
        terminarJuego("¡La serpiente salió del sendero!");
        return;
    }

    const comiendo = nuevaCabeza.x === manzana.x && nuevaCabeza.y === manzana.y;
    // Si no va a comer, la cola se mueve y esa casilla queda libre en este turno.
    const cuerpoARevisar = comiendo ? serpiente : serpiente.slice(0, -1);
    if (cuerpoARevisar.some(parte => parte.x === nuevaCabeza.x && parte.y === nuevaCabeza.y)) {
        terminarJuego("La serpiente chocó consigo misma.");
        return;
    }

    serpiente.unshift(nuevaCabeza);
    if (comiendo) {
        puntaje += 10;
        const nivelNuevo = Math.floor(puntaje / (COMIDAS_POR_NIVEL * 10)) + 1;
        if (nivelNuevo > nivel) {
            nivel = nivelNuevo;
            velocidad = Math.max(90, VELOCIDAD_INICIAL - (nivel - 1) * 35);
            reproducirSonido("nivel");
            elementoEstado.textContent = `¡Nivel ${nivel}! La serpiente es más rápida.`;
            arrancarTemporizadores();
        } else {
            reproducirSonido("comer");
        }
        manzana = crearManzana();
        actualizarMarcadores();
    } else {
        serpiente.pop();
    }
    renderizar();
}

function cambiarDireccion(nuevaDireccion) {
    if (gameOver) return;
    const direcciones = {
        arriba: { x: 0, y: -1 },
        abajo: { x: 0, y: 1 },
        izquierda: { x: -1, y: 0 },
        derecha: { x: 1, y: 0 }
    };
    const candidata = direcciones[String(nuevaDireccion).toLowerCase()];
    if (!candidata) return;

    // Producto escalar negativo en direcciones opuestas: no se permite dar media vuelta.
    if (candidata.x + direccion.x === 0 && candidata.y + direccion.y === 0) return;
    siguienteDireccion = candidata;
}

function terminarJuego(motivo) {
    gameOver = true;
    pausado = true;
    limpiarTemporizadores();
    reproducirSonido("fin");
    elementoEstado.textContent = `Fin de partida · Puntaje: ${puntaje}`;
    mostrarMensaje("🍂", "GAME OVER", `${motivo} Puntaje final: ${puntaje}.`, "Jugar otra vez", reiniciarJuego);
}

function actualizarMarcadores() {
    elementoPuntaje.textContent = puntaje;
    elementoNivel.textContent = nivel;
}

function actualizarReloj() {
    const minutos = Math.floor(segundos / 60).toString().padStart(2, "0");
    const seg = (segundos % 60).toString().padStart(2, "0");
    elementoTiempo.textContent = `${minutos}:${seg}`;
}

function mostrarMensaje(icono, etiqueta, texto, textoBoton, accion) {
    mensajeIcono.textContent = icono;
    mensajeEtiqueta.textContent = etiqueta;
    mensajeTitulo.textContent = etiqueta === "GAME OVER" ? "Fin de la partida" :
        etiqueta === "PARTIDA EN PAUSA" ? "Pausa del bosque" : "¿Listo para jugar?";
    mensajeTexto.textContent = texto;

    let boton = capaMensaje.querySelector("button");
    if (!boton) {
        boton = document.createElement("button");
        boton.type = "button";
        boton.className = "boton boton-principal";
        capaMensaje.querySelector(".tarjeta-mensaje").appendChild(boton);
    }
    boton.textContent = textoBoton;
    boton.onclick = accion;
    capaMensaje.classList.remove("oculto");
}

function ocultarMensaje() {
    capaMensaje.classList.add("oculto");
}

function reproducirSonido(tipo) {
    if (!sonidoActivado) return;
    try {
        const AudioContextClase = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClase) return;
        if (!audioContext) audioContext = new AudioContextClase();
        if (audioContext.state === "suspended") audioContext.resume();

        const patrones = {
            inicio: [{ f: 440, d: 0.09 }, { f: 660, d: 0.12 }],
            comer: [{ f: 660, d: 0.07 }, { f: 880, d: 0.1 }],
            nivel: [{ f: 523, d: 0.09 }, { f: 659, d: 0.09 }, { f: 784, d: 0.16 }],
            fin: [{ f: 330, d: 0.14 }, { f: 247, d: 0.22 }]
        };
        let inicio = audioContext.currentTime;
        patrones[tipo].forEach(nota => {
            const oscilador = audioContext.createOscillator();
            const ganancia = audioContext.createGain();
            oscilador.type = "sine";
            oscilador.frequency.value = nota.f;
            ganancia.gain.setValueAtTime(0.0001, inicio);
            ganancia.gain.exponentialRampToValueAtTime(0.12, inicio + 0.015);
            ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + nota.d);
            oscilador.connect(ganancia);
            ganancia.connect(audioContext.destination);
            oscilador.start(inicio);
            oscilador.stop(inicio + nota.d + 0.02);
            inicio += nota.d;
        });
    } catch (error) {
        // El juego sigue funcionando aunque el navegador bloquee el audio.
    }
}

controlSonido.addEventListener("change", () => {
    sonidoActivado = controlSonido.checked;
    elementoEstado.textContent = sonidoActivado ? "Sonido activado" : "Sonido desactivado";
});

document.addEventListener("keydown", evento => {
    const teclas = {
        ArrowUp: "arriba", w: "arriba", W: "arriba",
        ArrowDown: "abajo", s: "abajo", S: "abajo",
        ArrowLeft: "izquierda", a: "izquierda", A: "izquierda",
        ArrowRight: "derecha", d: "derecha", D: "derecha"
    };
    if (teclas[evento.key]) {
        evento.preventDefault();
        cambiarDireccion(teclas[evento.key]);
    } else if (evento.code === "Space") {
        evento.preventDefault();
        pausarJuego();
    }
});

function prepararBotonPausa() {
    botonPausa.innerHTML = "Ⅱ <span>Pausar</span>";
}

iniciarEstadoInicial();
prepararBotonPausa();
mostrarMensaje("🐍", "EL BOSQUE TE ESPERA", "Come la manzana roja. No choques con los bordes ni contigo mismo.", "Comenzar partida", iniciarJuego);
