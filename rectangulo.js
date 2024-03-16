import { drawLineBresenham } from './lineaBresenham.js';

// Función para dibujar un rectángulo dados sus coordenadas de esquina superior izquierda y su ancho y alto
export function drawRectangle(ctx, x, y, width, height) {
    // Dibujar los cuatro lados del rectángulo
    drawLineBresenham(ctx, x, y, x + width, y);
    drawLineBresenham(ctx, x + width, y, x + width, y + height);
    drawLineBresenham(ctx, x + width, y + height, x, y + height);
    drawLineBresenham(ctx, x, y + height, x, y);
}