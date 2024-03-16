import { drawLineBresenham } from './lineaBresenham.js';
export function drawTrapezoid(ctx, startX, startY, x, y) {
    var topLeftX = startX;
    var topLeftY = startY;
    var topRightX = x;
    var bottomRightX = x + (x - startX) / 2;
    var bottomRightY = y;
    var bottomLeftX = startX - (x - startX) / 2;

    drawLineBresenham(ctx, Math.round(topLeftX), Math.round(topLeftY), Math.round(topRightX), Math.round(topLeftY)); // Borde superior
    drawLineBresenham(ctx, Math.round(topRightX), Math.round(topLeftY), Math.round(bottomRightX), Math.round(bottomRightY)); // Borde derecho
    drawLineBresenham(ctx, Math.round(bottomRightX), Math.round(bottomRightY), Math.round(bottomLeftX), Math.round(bottomRightY)); // Borde inferior
    drawLineBresenham(ctx, Math.round(bottomLeftX), Math.round(bottomRightY), Math.round(topLeftX), Math.round(topLeftY)); // Borde izquierdo
}