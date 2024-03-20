import { drawPixel } from './lineaBresenham.js';


// Función para dibujar una elipse a partir de su centro y semiejes (a y b)
export function drawEllipse(ctx, xc, yc, a, b, stroke, angle = 0) {
    let cosAngle = Math.cos(angle);
    let sinAngle = Math.sin(angle);
    const points = 3240; // Aumentamos el número de puntos a generar

    for (let i = 0; i <= points; i++) {
        let angle = (i * Math.PI * 2) / points;
        let x = Math.round(a * Math.cos(angle));
        let y = Math.round(b * Math.sin(angle));

        // Rotar y trasladar los puntos de la elipse
        let xRotated = Math.round(x * cosAngle - y * sinAngle) + xc;
        let yRotated = Math.round(x * sinAngle + y * cosAngle) + yc;

        drawPixel(ctx, xRotated, yRotated, stroke);
    }

}
export function selectedEllipse(ctx, xc, yc, a, b, stroke, px, py, angle = 0) {
    let cosAngle = Math.cos(angle);
    let sinAngle = Math.sin(angle);
    const points = 720; // Aumentamos el número de puntos a generar

    for (let i = 0; i <= points; i++) {
        let angle = (i * Math.PI * 2) / points;
        let x = Math.round(a * Math.cos(angle));
        let y = Math.round(b * Math.sin(angle));

        // Rotar y trasladar los puntos de la elipse
        let xRotated = Math.round(x * cosAngle - y * sinAngle) + xc;
        let yRotated = Math.round(x * sinAngle + y * cosAngle) + yc;

        if (verify(xRotated, yRotated, px, py, stroke)) {
            return true;
        }
    }

    return false;
}


function verify(x1, y1, x, y, s) {
    if (x1 >= x - s + 1 && x1 <= x + s + 1 && y1 >= y - s + 1 && y1 <= y + s + 1) {
        return true;
    }
}