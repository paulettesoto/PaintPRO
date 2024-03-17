import { drawPixel, selectedLineBresenham } from './lineaBresenham.js';
// Función para dibujar los puntos simétricos de la elipse en un octante
function drawEllipsePoints(ctx, xc, yc, x, y, stroke) {
    // Dibujar los puntos simétricos en el octante
    drawPixel(ctx, xc + x, yc + y, stroke);
    drawPixel(ctx, xc - x, yc + y, stroke);
    drawPixel(ctx, xc + x, yc - y, stroke);
    drawPixel(ctx, xc - x, yc - y, stroke);
}

// Función para dibujar una elipse a partir de su centro y semiejes (a y b)
export function drawEllipse(ctx, xc, yc, a, b, stroke) {
    let x = 0;
    let y = b;
    let a2 = a * a;
    let b2 = b * b;
    let d = Math.round(b2 - a2 * b + 0.25 * a2);
    let dx = 2 * b2 * x;
    let dy = 2 * a2 * y;

    while (dx < dy) {
        drawEllipsePoints(ctx, xc, yc, x, y, stroke);

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
        drawEllipsePoints(ctx, xc, yc, x, y, stroke);

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

function selectedEllipsePoints(ctx, xc, yc, x, y, stroke, px, py) {

    var x1 = xc + x;
    var y1 = yc + y;
    //selectedLineBresenham(ctx, xc + x, yc + y, stroke)
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        return true;
    }
    x1 = xc - x;
    y1 = yc + y;
    //selectedLineBresenham(ctx, xc - x, yc + y, stroke)
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        return true;
    }
    x1 = xc + x;
    y1 = yc - y;
    //selectedLineBresenham(ctx, xc + x, yc - y, stroke)
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        return true;
    }
    x1 = xc - x;
    y1 = yc - y;
    //selectedLineBresenham(ctx, xc - x, yc - y, stroke)
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        return true;
    }

}

// Función para dibujar una elipse a partir de su centro y semiejes (a y b)
export function selectedEllipse(ctx, xc, yc, a, b, stroke, px, py) {
    let x = 0;
    let y = b;
    let a2 = a * a;
    let b2 = b * b;
    let d = Math.round(b2 - a2 * b + 0.25 * a2);
    let dx = 2 * b2 * x;
    let dy = 2 * a2 * y;

    while (dx < dy) {
        if (selectedEllipsePoints(ctx, xc, yc, x, y, stroke, px, py)) {
            //console.log("Elipse seleccionado");
            return true;
        }

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
        if (selectedEllipsePoints(ctx, xc, yc, x, y, stroke, px, py)) {
            //console.log("Elipse seleccionado");
            return true;
        }

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