// Función para dibujar la línea con el algoritmo Bresenham
export function drawLineBresenham(ctx, x0, y0, x1, y1) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    let x = x0;
    let y = y0;
    while (true) {
        drawPixel(ctx, x, y)
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

export function drawPixel(ctx, x, y) {

    ctx.fillRect(x, y, 1, 1); // Dibuja el píxel    
}

export function setColor(ctx, color) {
    ctx.fillStyle = color;
}