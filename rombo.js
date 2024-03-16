// Función para dibujar un rombo a partir de su centro y dimensiones
export function drawRhombus(ctx, centerX, centerY, mouseX, mouseY) {
    // Calcular los vértices del rombo
    var vertices = [
        { x: centerX, y: centerY - Math.abs(mouseY - centerY) }, // Punto superior
        { x: centerX + Math.abs(mouseX - centerX), y: centerY }, // Punto derecho
        { x: centerX, y: centerY + Math.abs(mouseY - centerY) }, // Punto inferior
        { x: centerX - Math.abs(mouseX - centerX), y: centerY } // Punto izquierdo
    ];

    // Dibujar el rombo pixel por pixel
    for (var i = 0; i < vertices.length; i++) {
        var startPoint = vertices[i];
        var endPoint = vertices[(i + 1) % vertices.length];
        drawLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }
}

// Función para dibujar una línea entre dos puntos usando el algoritmo de Bresenham
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