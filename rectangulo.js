import { drawLineBresenham, selectedLineBresenham } from './lineaBresenham.js';

// Función para dibujar un rectángulo dados sus coordenadas de esquina superior izquierda y su ancho y alto
export function drawRectangle(ctx, x, y, width, height, stroke, angle) {
    if (angle > 0) {

        // Calcular coordenadas de los vértices del rectángulo original
        const x1 = x;
        const y1 = y;
        const x2 = x + width;
        const y2 = y;
        const x3 = x + width;
        const y3 = y + height;
        const x4 = x;
        const y4 = y + height;

        // Calcular coordenadas de los vértices del rectángulo rotado
        const center_x = x + width / 2;
        const center_y = y + height / 2;

        const rotated_point1 = rotatePoint(x1, y1, center_x, center_y, angle);
        const rotated_point2 = rotatePoint(x2, y2, center_x, center_y, angle);
        const rotated_point3 = rotatePoint(x3, y3, center_x, center_y, angle);
        const rotated_point4 = rotatePoint(x4, y4, center_x, center_y, angle);

        // Dibujar líneas del rectángulo rotado
        console.log(rotated_point1, rotated_point2, rotated_point3, rotated_point4);
        drawLineBresenham(ctx, Math.round(rotated_point1.x), Math.round(rotated_point1.y), Math.round(rotated_point2.x), Math.round(rotated_point2.y), stroke);
        drawLineBresenham(ctx, Math.round(rotated_point2.x), Math.round(rotated_point2.y), Math.round(rotated_point3.x), Math.round(rotated_point3.y), stroke);
        drawLineBresenham(ctx, Math.round(rotated_point3.x), Math.round(rotated_point3.y), Math.round(rotated_point4.x), Math.round(rotated_point4.y), stroke);
        drawLineBresenham(ctx, Math.round(rotated_point4.x), Math.round(rotated_point4.y), Math.round(rotated_point1.x), Math.round(rotated_point1.y), stroke);

    } else {
        drawLineBresenham(ctx, x, y, x + width, y, stroke);
        drawLineBresenham(ctx, x + width, y, x + width, y + height, stroke);
        drawLineBresenham(ctx, x + width, y + height, x, y + height, stroke);
        drawLineBresenham(ctx, x, y + height, x, y, stroke);

    }

}

function rotatePoint(x, y, x1, y1, angle) {
    var newX = (x - x1) * Math.cos(angle) - (y - y1) * Math.sin(angle) + x1;
    var newY = (x - x1) * Math.sin(angle) + (y - y1) * Math.cos(angle) + y1;
    return { x: newX, y:  newY  };    
}

export function selectedRectangle(ctx, x, y, width, height, stroke, px, py, angle) {
    // Dibujar los cuatro lados del rectángulo
    if (angle > 0) {
        // Calcular coordenadas de los vértices del rectángulo original
        const x1 = x;
        const y1 = y;
        const x2 = x + width;
        const y2 = y;
        const x3 = x + width;
        const y3 = y + height;
        const x4 = x;
        const y4 = y + height;

        // Calcular coordenadas de los vértices del rectángulo rotado
        const center_x = x + width / 2;
        const center_y = y + height / 2;

        const rotated_point1 = rotatePoint(x1, y1, center_x, center_y, angle);
        const rotated_point2 = rotatePoint(x2, y2, center_x, center_y, angle);
        const rotated_point3 = rotatePoint(x3, y3, center_x, center_y, angle);
        const rotated_point4 = rotatePoint(x4, y4, center_x, center_y, angle);

        if (selectedLineBresenham(ctx, Math.round(rotated_point1.x), Math.round(rotated_point1.y), Math.round(rotated_point2.x), Math.round(rotated_point2.y), stroke, px, py) ||
            selectedLineBresenham(ctx, Math.round(rotated_point2.x), Math.round(rotated_point2.y), Math.round(rotated_point3.x), Math.round(rotated_point3.y), stroke, px, py) ||
            selectedLineBresenham(ctx, Math.round(rotated_point3.x), Math.round(rotated_point3.y), Math.round(rotated_point4.x), Math.round(rotated_point4.y), stroke, px, py) ||
            selectedLineBresenham(ctx, Math.round(rotated_point4.x), Math.round(rotated_point4.y), Math.round(rotated_point1.x), Math.round(rotated_point1.y), stroke, px, py)) {
            return true;
        }

    } else if (selectedLineBresenham(ctx, x, y, x + width, y, stroke, px, py) ||
        selectedLineBresenham(ctx, x + width, y, x + width, y + height, stroke, px, py) ||
        selectedLineBresenham(ctx, x + width, y + height, x, y + height, stroke, px, py) ||
        selectedLineBresenham(ctx, x, y + height, x, y, stroke, px, py)) {
        //console.log("Rectangulo seleccionado")
        return true;
    }
}