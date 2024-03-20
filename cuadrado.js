import { drawLineBresenham, selectedLineBresenham } from './lineaBresenham.js';

// Función para dibujar un cuadrado dados sus coordenadas de esquina superior izquierda y tamaño
export function drawSquare(ctx, x, y, size, stroke, angle) {
    if (angle > 0) {
        // Calcular las coordenadas de los vértices del cuadrado rotado
        let topLeft = rotatePoint(x, y, x + size / 2, y + size / 2, angle);
        let topRight = rotatePoint(x + size, y, x + size / 2, y + size / 2, angle);
        let bottomRight = rotatePoint(x + size, y + size, x + size / 2, y + size / 2, angle);
        let bottomLeft = rotatePoint(x, y + size, x + size / 2, y + size / 2, angle);

        // Dibujar los cuatro lados del cuadrado rotado
        drawLineBresenham(ctx, Math.round(topLeft.x), Math.round(topLeft.y), Math.round(topRight.x), Math.round(topRight.y), stroke);
        drawLineBresenham(ctx, Math.round(topRight.x), Math.round(topRight.y), Math.round(bottomRight.x), Math.round(bottomRight.y), stroke);
        drawLineBresenham(ctx, Math.round(bottomRight.x), Math.round(bottomRight.y), Math.round(bottomLeft.x), Math.round(bottomLeft.y), stroke);
        drawLineBresenham(ctx, Math.round(bottomLeft.x), Math.round(bottomLeft.y), Math.round(topLeft.x), Math.round(topLeft.y), stroke);
    } else {
        // Dibujar los cuatro lados del cuadrado
        drawLineBresenham(ctx, x, y, x + size, y, stroke);
        drawLineBresenham(ctx, x + size, y, x + size, y + size, stroke);
        drawLineBresenham(ctx, x + size, y + size, x, y + size, stroke);
        drawLineBresenham(ctx, x, y + size, x, y, stroke);

    }

}

function rotatePoint(x, y, x1, y1, angle) {
    var newX = (x - x1) * Math.cos(angle) - (y - y1) * Math.sin(angle) + x1;
    var newY = (x - x1) * Math.sin(angle) + (y - y1) * Math.cos(angle) + y1;
    return { x: newX, y:  newY  };    
}
export function selectedSquare(ctx, x, y, size, stroke, px, py, angle) {
    // Dibujar los cuatro lados del cuadrado
    if (angle > 0) {
        console.log("aqui estoy")
            // Calcular las coordenadas de los vértices del cuadrado rotado
        let topLeft = rotatePoint(x, y, x + size / 2, y + size / 2, angle);
        let topRight = rotatePoint(x + size, y, x + size / 2, y + size / 2, angle);
        let bottomRight = rotatePoint(x + size, y + size, x + size / 2, y + size / 2, angle);
        let bottomLeft = rotatePoint(x, y + size, x + size / 2, y + size / 2, angle);

        if (selectedLineBresenham(ctx, Math.round(topLeft.x), Math.round(topLeft.y), Math.round(topRight.x), Math.round(topRight.y), stroke, px, py) ||
            selectedLineBresenham(ctx, Math.round(topRight.x), Math.round(topRight.y), Math.round(bottomRight.x), Math.round(bottomRight.y), stroke, px, py) ||
            selectedLineBresenham(ctx, Math.round(bottomRight.x), Math.round(bottomRight.y), Math.round(bottomLeft.x), Math.round(bottomLeft.y), stroke, px, py) ||
            selectedLineBresenham(ctx, Math.round(bottomLeft.x), Math.round(bottomLeft.y), Math.round(topLeft.x), Math.round(topLeft.y), stroke, px, py)) {
            return true;
        }

    } else {
        if (selectedLineBresenham(ctx, x, y, x + size, y, stroke, px, py) ||
            selectedLineBresenham(ctx, x + size, y, x + size, y + size, stroke, px, py) ||
            selectedLineBresenham(ctx, x + size, y + size, x, y + size, stroke, px, py) ||
            selectedLineBresenham(ctx, x, y + size, x, y, stroke, px, py)) {
            //console.log("Cuadrado seleccionado")
            return true;
        }

    }

}