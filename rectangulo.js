// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Array para almacenar todos los rectángulos dibujados
var rectangles = [];

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

// Función para dibujar un rectángulo dados sus coordenadas de esquina superior izquierda y su ancho y alto
function drawRectangle(x, y, width, height) {
    // Dibujar los cuatro lados del rectángulo
    drawLineBresenham(x, y, x + width, y);
    drawLineBresenham(x + width, y, x + width, y + height);
    drawLineBresenham(x + width, y + height, x, y + height);
    drawLineBresenham(x, y + height, x, y);
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

    // Dibujar todos los rectángulos almacenados
    rectangles.forEach(function(rectangle) {
        drawRectangle(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    });

    // Dibujar el rectángulo actual mientras se arrastra el mouse
    drawRectangle(startX, startY, x - startX, y - startY);
});

// Manejar evento de mouseup
canvas.addEventListener("mouseup", function(event) {
    if (!isDrawing) return; // Salir si no estamos dibujando

    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    // Calcular el ancho y alto del rectángulo
    var width = x - startX;
    var height = y - startY;

    // Almacenar el rectángulo dibujado actualmente
    rectangles.push({ x: startX, y: startY, width: width, height: height });

    // Restablecer la bandera de dibujo
    isDrawing = false;
});