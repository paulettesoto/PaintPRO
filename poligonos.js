// Algoritmo de Bresenham para dibujar una línea entre dos puntos
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

// Función para dibujar un polígono regular a partir de un número de lados, radio y centro
export function drawPolygon(ctx, numSides, radius, centerX, centerY, initialAngle) {
    var angle = (2 * Math.PI) / numSides; // Ángulo central de cada vértice
    var lastX, lastY;

    for (var i = 0; i < numSides; i++) {
        var x = Math.round(centerX + radius * Math.cos(angle * i + initialAngle));
        var y = Math.round(centerY + radius * Math.sin(angle * i + initialAngle));

        if (i > 0) {
            drawLineBresenham(ctx, lastX, lastY, x, y);
        }

        lastX = x;
        lastY = y;
    }
    // Dibujar la última línea que conecta el último punto con el primero
    drawLineBresenham(ctx, lastX, lastY, Math.round(centerX + radius * Math.cos(initialAngle)), Math.round(centerY + radius * Math.sin(initialAngle)));
}