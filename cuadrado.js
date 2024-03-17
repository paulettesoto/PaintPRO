import { drawLineBresenham, selectedLineBresenham } from './lineaBresenham.js';

// Función para dibujar un cuadrado dados sus coordenadas de esquina superior izquierda y tamaño
export function drawSquare(ctx, x, y, size, stroke) {
    // Dibujar los cuatro lados del cuadrado
    drawLineBresenham(ctx, x, y, x + size, y, stroke);
    drawLineBresenham(ctx, x + size, y, x + size, y + size, stroke);
    drawLineBresenham(ctx, x + size, y + size, x, y + size, stroke);
    drawLineBresenham(ctx, x, y + size, x, y, stroke);
}

export function selectedSquare(ctx, x, y, size, stroke, px, py) {
    // Dibujar los cuatro lados del cuadrado

    if (selectedLineBresenham(ctx, x, y, x + size, y, stroke, px, py) ||
        selectedLineBresenham(ctx, x + size, y, x + size, y + size, stroke, px, py) ||
        selectedLineBresenham(ctx, x + size, y + size, x, y + size, stroke, px, py) ||
        selectedLineBresenham(ctx, x, y + size, x, y, stroke, px, py)) {
        //console.log("Cuadrado seleccionado")
        return true;
    }
}