// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Array para almacenar todos los rombos dibujados
var rhombuses = [];

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

    // Dibujar todos los rombos almacenados
    rhombuses.forEach(function(rhombus) {
        console.log("anterior", rhombus.centerX, rhombus.centerY, rhombus.width, rhombus.height);
        drawRhombus(rhombus.centerX, rhombus.centerY, rhombus.width, rhombus.height);
    });

    // Dibujar el rombo actual mientras se arrastra el mouse
    console.log("nuevo", startX, startY, x, y);
    drawRhombus(startX, startY, x, y);
});

// Manejar evento de mouseup
canvas.addEventListener("mouseup", function(event) {
    if (!isDrawing) return; // Salir si no estamos dibujando

    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    // Almacenar el rombo dibujado actualmente
    console.log("push", startX, startY, x, y);
    rhombuses.push({ centerX: startX, centerY: startY, width: x, height: y });

    // Restablecer la bandera de dibujo
    isDrawing = false;
});

// Función para dibujar un rombo a partir de su centro y dimensiones
function drawRhombus(centerX, centerY, mouseX, mouseY) {
    // Calcular los vértices del rombo
    var vertices = [
        { x: centerX, y: centerY - Math.abs(mouseY - centerY) }, // Punto superior
        { x: centerX + Math.abs(mouseX - centerX), y: centerY }, // Punto derecho
        { x: centerX, y: centerY + Math.abs(mouseY - centerY) }, // Punto inferior
        { x: centerX - Math.abs(mouseX - centerX), y: centerY } // Punto izquierdo
    ];

    // Dibujar el rombo pixel por pixel usando Bresenham's line algorithm
    for (var i = 0; i < vertices.length; i++) {
        var startPoint = vertices[i];
        var endPoint = vertices[(i + 1) % vertices.length];
        drawLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }
}

// Función para dibujar una línea entre dos puntos usando Bresenham's line algorithm
function drawLineBresenham(ctx, x0, y0, x1, y1) {
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