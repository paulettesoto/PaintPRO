// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Función para dibujar un punto en un octante y reflejarlo en los otros siete octantes
function drawCirclePoints(ctx, x0, y0, x, y) {
    // Dibujar el punto en el octante
    ctx.fillRect(x0 + x, y0 + y, 1, 1);
    // Reflejar en los otros siete octantes
    ctx.fillRect(x0 + y, y0 + x, 1, 1);
    ctx.fillRect(x0 + y, y0 - x, 1, 1);
    ctx.fillRect(x0 + x, y0 - y, 1, 1);
    ctx.fillRect(x0 - x, y0 - y, 1, 1);
    ctx.fillRect(x0 - y, y0 - x, 1, 1);
    ctx.fillRect(x0 - y, y0 + x, 1, 1);
    ctx.fillRect(x0 - x, y0 + y, 1, 1);
}

// Función para dibujar un círculo a partir de un octeto (x, y)
export function drawCircleBresenham(ctx, x0, y0, radius) {
    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;

    while (x <= y) {
        drawCirclePoints(ctx, x0, y0, x, y);
        x++;
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
        drawCirclePoints(ctx, x0, y0, x, y);
    }
}