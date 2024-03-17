import { drawLineBresenham, selectedLineBresenham } from './lineaBresenham.js';

// Función para dibujar un rectángulo dados sus coordenadas de esquina superior izquierda y su ancho y alto
export function drawRectangle(ctx, x, y, width, height, stroke) {
    // Dibujar los cuatro lados del rectángulo
    drawLineBresenham(ctx, x, y, x + width, y, stroke);
    drawLineBresenham(ctx, x + width, y, x + width, y + height, stroke);
    drawLineBresenham(ctx, x + width, y + height, x, y + height, stroke);
    drawLineBresenham(ctx, x, y + height, x, y, stroke);
}

export function selectedRectangle(ctx, x, y, width, height, stroke, px, py) {
    // Dibujar los cuatro lados del rectángulo
    if (selectedLineBresenham(ctx, x, y, x + width, y, stroke, px, py) ||
        selectedLineBresenham(ctx, x + width, y, x + width, y + height, stroke, px, py) ||
        selectedLineBresenham(ctx, x + width, y + height, x, y + height, stroke, px, py) ||
        selectedLineBresenham(ctx, x, y + height, x, y, stroke, px, py)) {
        //console.log("Rectangulo seleccionado")
        return true;
    }
}