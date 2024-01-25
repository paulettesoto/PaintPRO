// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Variables para almacenar las coordenadas de los puntos
var x1, y1, x2, y2;

// Variable para indicar si es el primer o segundo click
var primerClick = true;

// Manejador de evento de click
canvas.addEventListener("click", function(event) {
    // Obtener las coordenadas del click
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    // Si es el primer click, guardar las coordenadas
    if (primerClick) {
        x1 = x;
        y1 = y;
        primerClick = false;
    } else {
        // Si es el segundo click, calcular la pendiente y la intersección en y
        x2 = x;
        y2 = y;

        // Calcular la pendiente (m) y la intersección en y (b)
        var m = (y2 - y1) / (x2 - x1);
        var b = y1 - m * x1;

        // Calcular los puntos intermedios y dibujar la línea
        drawLine(x1, y1, x2, y2, m, b);

        // Reiniciar para permitir la creación de una nueva línea
        primerClick = true;
    }
});

// Función para dibujar la línea
function drawLine(x1, y1, x2, y2, m, b) {
    // Determinar el rango de coordenadas x para dibujar la línea
    var startX = Math.min(x1, x2);
    var endX = Math.max(x1, x2);

    // Dibujar la línea punto por punto
    for (var x = startX; x <= endX; x++) {
        // Calcular la coordenada y correspondiente utilizando la fórmula y = mx + b
        var y = m * x + b;

        // Dibujar el punto
        drawPixel(x, y);
    }
}

// Función para dibujar un píxel en el lienzo
function drawPixel(x, y) {
    // Obtener el imageData del canvas
    var imageData = ctx.getImageData(x, y, 1, 1);
    var data = imageData.data;

    // Establecer el color del píxel
    data[0] = 0; // R
    data[1] = 0; // G
    data[2] = 0; // B
    data[3] = 255; // A

    // Actualizar el imageData del canvas con el píxel modificado
    ctx.putImageData(imageData, x, y);
}