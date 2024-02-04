// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Array para almacenar todos los cuadrados dibujados
var squares = [];

// Función para dibujar la línea con el algoritmo de Bresenham
function drawLineBresenham(x0, y0, x1, y1) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    let x = x0;
    let y = y0;

    while (true) {
        ctx.fillRect(x, y, 1, 1); // Dibuja el píxel
        if (x === x1 && y === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
}

// Función para dibujar un cuadrado dados sus coordenadas de esquina superior izquierda y tamaño
function drawSquare(x, y, size) {
    // Dibujar los cuatro lados del cuadrado
    drawLineBresenham(x, y, x + size, y);
    drawLineBresenham(x + size, y, x + size, y + size);
    drawLineBresenham(x + size, y + size, x, y + size);
    drawLineBresenham(x, y + size, x, y);
}

var startX, startY;
var isDrawing = false;

// Manejar evento de mousedown
canvas.addEventListener("mousedown", function(event) {
    // Obtener las coordenadas del click
    var rect = canvas.getBoundingClientRect();
    startX = Math.round(event.clientX - rect.left);
    startY = Math.round(event.clientY - rect.top);
    isDrawing = true;
});

// Manejar evento de mousemove
canvas.addEventListener("mousemove", function(event) {
    if (!isDrawing) return; // Salir si no estamos dibujando

    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    // Limpiar el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar todos los cuadrados almacenados
    squares.forEach(function(square) {
        drawSquare(square.x, square.y, square.size);
    });

    // Dibujar el cuadrado actual mientras se arrastra el mouse
    drawSquare(startX, startY, Math.abs(x - startX));
});

// Manejar evento de mouseup
canvas.addEventListener("mouseup", function(event) {
    if (!isDrawing) return; // Salir si no estamos dibujando

    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    // Calcular el tamaño del cuadrado
    var size = Math.abs(x - startX);

    // Almacenar el cuadrado dibujado actualmente
    squares.push({ x: startX, y: startY, size: size });

    // Restablecer la bandera de dibujo
    isDrawing = false;
});