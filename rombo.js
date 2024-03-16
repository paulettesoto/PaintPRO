import { drawLineBresenham } from './lineaBresenham.js';

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