// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Array para almacenar todos los trapecios dibujados
var trapezoids = [];

var startX, startY;
var isDrawing = false;

// Función para dibujar un trapecio a partir de sus vértices
function drawTrapezoid(startX, startY, x, y) {
    var topLeftX = startX;
    var topLeftY = startY;
    var topRightX = x;
    var topRightY = startY;
    var bottomRightX = x + (x - startX) / 2;
    var bottomRightY = y;
    var bottomLeftX = startX - (x - startX) / 2;
    var bottomLeftY = y;

    // Calcular las coordenadas de los cuatro lados del trapecio
    var leftSlope = (bottomLeftY - topLeftY) / (bottomLeftX - topLeftX);
    var rightSlope = (bottomRightY - topRightY) / (bottomRightX - topRightX);
    var topSlope = (topRightY - topLeftY) / (topRightX - topLeftX);

    var leftX, rightX, leftY, rightY, topX, topY;

    // Dibujar el trapecio píxel por píxel
    for (var y = topLeftY; y <= bottomLeftY; y++) {
        leftX = Math.round(topLeftX + (y - topLeftY) / leftSlope);
        rightX = Math.round(topRightX + (y - topRightY) / rightSlope);
        leftY = rightY = y;

        ctx.fillRect(leftX, leftY, 1, 1); // Dibujar el borde izquierdo
        ctx.fillRect(rightX, rightY, 1, 1); // Dibujar el borde derecho
    }

    // Dibujar el borde superior
    for (var x = topLeftX; x <= topRightX; x++) {
        topX = x;
        topY = Math.round(topLeftY + (x - topLeftX) * topSlope);
        ctx.fillRect(topX, topY, 1, 1);
    }

    // Dibujar el borde inferior
    for (var x = bottomLeftX; x <= bottomRightX; x++) {
        ctx.fillRect(x, bottomLeftY, 1, 1);
    }
}



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

    // Dibujar todos los trapecios almacenados
    trapezoids.forEach(function(trapezoid) {
        drawTrapezoid(trapezoid.startX, trapezoid.startY, trapezoid.endX, trapezoid.endY);
    });

    // Dibujar el trapecio actual mientras se arrastra el mouse
    drawTrapezoid(startX, startY, x, y);
});

// Manejar evento de mouseup
canvas.addEventListener("mouseup", function(event) {
    if (!isDrawing) return; // Salir si no estamos dibujando

    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    // Almacenar el trapecio dibujado actualmente
    trapezoids.push({ startX: startX, startY: startY, endX: x, endY: y });

    // Restablecer la bandera de dibujo
    isDrawing = false;
});