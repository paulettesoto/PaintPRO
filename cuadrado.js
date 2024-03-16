import { drawLineBresenham } from './lineaBresenham.js';

// Función para dibujar un cuadrado dados sus coordenadas de esquina superior izquierda y tamaño
export function drawSquare(ctx, x, y, size) {
    // Dibujar los cuatro lados del cuadrado
    drawLineBresenham(ctx, x, y, x + size, y);
    drawLineBresenham(ctx, x + size, y, x + size, y + size);
    drawLineBresenham(ctx, x + size, y + size, x, y + size);
    drawLineBresenham(ctx, x, y + size, x, y);
}