import { drawLineBresenham, selectedLineBresenham } from './lineaBresenham.js';

export function drawTrapezoid(ctx, startX, startY, x, y, stroke) {
    var topLeftX = startX;
    var topLeftY = startY;
    var topRightX = x;
    var bottomRightX = x + (x - startX) / 2;
    var bottomRightY = y;
    var bottomLeftX = startX - (x - startX) / 2;

    drawLineBresenham(ctx, Math.round(topLeftX), Math.round(topLeftY), Math.round(topRightX), Math.round(topLeftY), stroke); // Borde superior
    drawLineBresenham(ctx, Math.round(topRightX), Math.round(topLeftY), Math.round(bottomRightX), Math.round(bottomRightY), stroke); // Borde derecho
    drawLineBresenham(ctx, Math.round(bottomRightX), Math.round(bottomRightY), Math.round(bottomLeftX), Math.round(bottomRightY), stroke); // Borde inferior
    drawLineBresenham(ctx, Math.round(bottomLeftX), Math.round(bottomRightY), Math.round(topLeftX), Math.round(topLeftY), stroke); // Borde izquierdo
}

export function selectedTrapezoid(ctx, startX, startY, x, y, stroke, px, py) {
    var topLeftX = startX;
    var topLeftY = startY;
    var topRightX = x;
    var bottomRightX = x + (x - startX) / 2;
    var bottomRightY = y;
    var bottomLeftX = startX - (x - startX) / 2;

    if (selectedLineBresenham(ctx, Math.round(topLeftX), Math.round(topLeftY), Math.round(topRightX), Math.round(topLeftY), stroke, px, py) ||
        selectedLineBresenham(ctx, Math.round(topRightX), Math.round(topLeftY), Math.round(bottomRightX), Math.round(bottomRightY), stroke, px, py) ||
        selectedLineBresenham(ctx, Math.round(bottomRightX), Math.round(bottomRightY), Math.round(bottomLeftX), Math.round(bottomRightY), stroke, px, py) ||
        selectedLineBresenham(ctx, Math.round(bottomLeftX), Math.round(bottomRightY), Math.round(topLeftX), Math.round(topLeftY), stroke, px, py)
    ) {
        //console.log("Trapecio seleccionado")
        return true;
    }
}