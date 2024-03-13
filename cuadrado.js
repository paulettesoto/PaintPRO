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

// Función para dibujar un cuadrado dados sus coordenadas de esquina superior izquierda y tamaño
export function drawSquare(ctx, x, y, size) {
    // Dibujar los cuatro lados del cuadrado
    drawLineBresenham(ctx, x, y, x + size, y);
    drawLineBresenham(ctx, x + size, y, x + size, y + size);
    drawLineBresenham(ctx, x + size, y + size, x, y + size);
    drawLineBresenham(ctx, x, y + size, x, y);
}