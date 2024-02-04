// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Array para almacenar todas las líneas dibujadas
var lines = [];

// Función para dibujar la línea con el algoritmo DDA
function drawLineDDA(x0, y0, x1, y1) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    var steps = Math.max(Math.abs(dx), Math.abs(dy));
    var xIncrement = dx / steps;
    var yIncrement = dy / steps;
    var x = x0;
    var y = y0;

    for (var i = 0; i <= steps; i++) {
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
        x += xIncrement;
        y += yIncrement;
    }
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

    // Dibujar todas las líneas almacenadas
    lines.forEach(function(line) {
        drawLineDDA(line.startX, line.startY, line.endX, line.endY);
    });

    // Dibujar la línea actual mientras se arrastra el mouse
    drawLineDDA(startX, startY, x, y);
});

// Manejar evento de mouseup
canvas.addEventListener("mouseup", function(event) {
    if (!isDrawing) return; // Salir si no estamos dibujando

    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    // Almacenar la línea dibujada actualmente
    lines.push({ startX: startX, startY: startY, endX: x, endY: y });

    // Restablecer la bandera de dibujo
    isDrawing = false;
});