import { drawLineBresenham } from './lineaBresenham.js';

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