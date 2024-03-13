// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");


// Función para dibujar la línea con el algoritmo de Bresenham
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

// Función para dibujar un rectángulo dados sus coordenadas de esquina superior izquierda y su ancho y alto
export function drawRectangle(ctx, x, y, width, height) {
    // Dibujar los cuatro lados del rectángulo
    drawLineBresenham(ctx, x, y, x + width, y);
    drawLineBresenham(ctx, x + width, y, x + width, y + height);
    drawLineBresenham(ctx, x + width, y + height, x, y + height);
    drawLineBresenham(ctx, x, y + height, x, y);
}