// Función para dibujar los puntos simétricos de la elipse en un octante
function drawEllipsePoints(ctx, xc, yc, x, y) {
    // Dibujar los puntos simétricos en el octante
    ctx.fillRect(xc + x, yc + y, 1, 1);
    ctx.fillRect(xc - x, yc + y, 1, 1);
    ctx.fillRect(xc + x, yc - y, 1, 1);
    ctx.fillRect(xc - x, yc - y, 1, 1);
}

// Función para dibujar una elipse a partir de su centro y semiejes (a y b)
export function drawEllipse(ctx, xc, yc, a, b) {
    let x = 0;
    let y = b;
    let a2 = a * a;
    let b2 = b * b;
    let d = Math.round(b2 - a2 * b + 0.25 * a2);
    let dx = 2 * b2 * x;
    let dy = 2 * a2 * y;

    while (dx < dy) {
        drawEllipsePoints(ctx, xc, yc, x, y);

        x++;
        dx += 2 * b2;
        if (d < 0) {
            d += b2 * (2 * x + 3);
        } else {
            y--;
            dy -= 2 * a2;
            d += b2 * (2 * x + 3) + a2 * (-2 * y + 2);
        }
    }

    d = Math.round(b2 * (x + 0.5) * (x + 0.5) + a2 * (y - 1) * (y - 1) - a2 * b2);
    while (y >= 0) {
        drawEllipsePoints(ctx, xc, yc, x, y);

        y--;
        dy -= 2 * a2;
        if (d > 0) {
            d += a2 * (-2 * y + 3);
        } else {
            x++;
            dx += 2 * b2;
            d += b2 * (2 * x + 2) + a2 * (-2 * y + 3);
        }
    }
}