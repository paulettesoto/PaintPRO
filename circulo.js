// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Array para almacenar todos los círculos dibujados
var circles = [];

// Función para dibujar un punto en un octante y reflejarlo en los otros siete octantes
function drawCirclePoints(x0, y0, x, y) {
    // Dibujar el punto en el octante
    ctx.fillRect(x0 + x, y0 + y, 1, 1);
    // Reflejar en los otros siete octantes
    ctx.fillRect(x0 + y, y0 + x, 1, 1);
    ctx.fillRect(x0 + y, y0 - x, 1, 1);
    ctx.fillRect(x0 + x, y0 - y, 1, 1);
    ctx.fillRect(x0 - x, y0 - y, 1, 1);
    ctx.fillRect(x0 - y, y0 - x, 1, 1);
    ctx.fillRect(x0 - y, y0 + x, 1, 1);
    ctx.fillRect(x0 - x, y0 + y, 1, 1);
}

// Función para dibujar un círculo a partir de un octeto (x, y)
function drawCircleBresenham(x0, y0, radius) {
    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;

    while (x <= y) {
        drawCirclePoints(x0, y0, x, y);
        x++;
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
        drawCirclePoints(x0, y0, x, y);
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

    // Dibujar todos los círculos almacenados
    circles.forEach(function(circle) {
        drawCircleBresenham(circle.centerX, circle.centerY, circle.radius);
    });

    // Dibujar el círculo actual mientras se arrastra el mouse
    drawCircleBresenham(startX, startY, Math.round(Math.sqrt((x - startX) ** 2 + (y - startY) ** 2)));
});

// Manejar evento de mouseup
canvas.addEventListener("mouseup", function(event) {
    if (!isDrawing) return; // Salir si no estamos dibujando

    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    // Calcular el radio del círculo
    var radius = Math.round(Math.sqrt((x - startX) ** 2 + (y - startY) ** 2));

    // Almacenar el círculo dibujado actualmente
    circles.push({ centerX: startX, centerY: startY, radius: radius });

    // Restablecer la bandera de dibujo
    isDrawing = false;
});