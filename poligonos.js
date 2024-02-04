var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Array para almacenar todos los polígonos dibujados
var polygons = [];

var isDragging = false;
var startX, startY, mouseX, mouseY;
var numSides = 9;
var radius = 50;
var initialAngle = 0; // Ángulo inicial

// Algoritmo de Bresenham para dibujar una línea entre dos puntos
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

// Función para dibujar un polígono regular a partir de un número de lados, radio y centro
function drawPolygon(numSides, radius, centerX, centerY, initialAngle) {
    var angle = (2 * Math.PI) / numSides; // Ángulo central de cada vértice
    var lastX, lastY;

    for (var i = 0; i < numSides; i++) {
        var x = Math.round(centerX + radius * Math.cos(angle * i + initialAngle));
        var y = Math.round(centerY + radius * Math.sin(angle * i + initialAngle));

        if (i > 0) {
            drawLineBresenham(lastX, lastY, x, y);
        }

        lastX = x;
        lastY = y;
    }
    // Dibujar la última línea que conecta el último punto con el primero
    drawLineBresenham(lastX, lastY, Math.round(centerX + radius * Math.cos(initialAngle)), Math.round(centerY + radius * Math.sin(initialAngle)));
}

// Manejar evento de mousedown
canvas.addEventListener('mousedown', function(e) {
    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
    mouseX = startX;
    mouseY = startY;
    initialAngle = 0; // Restablecer el ángulo inicial al iniciar un nuevo polígono
});

// Manejar evento de mousemove
canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        radius = Math.sqrt(Math.pow(mouseX - startX, 2) + Math.pow(mouseY - startY, 2));
        initialAngle = Math.atan2(mouseY - startY, mouseX - startX);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar todos los polígonos almacenados
        polygons.forEach(function(polygon) {
            drawPolygon(polygon.numSides, polygon.radius, polygon.centerX, polygon.centerY, polygon.initialAngle);
        });

        // Dibujar el polígono actual mientras se arrastra el mouse
        drawPolygon(numSides, radius, startX, startY, initialAngle);
    }
});

// Manejar evento de mouseup
canvas.addEventListener('mouseup', function(e) {
    if (isDragging) {
        isDragging = false;

        // Almacenar el polígono dibujado actualmente
        polygons.push({ numSides: numSides, radius: radius, centerX: startX, centerY: startY, initialAngle: initialAngle });
    }
});