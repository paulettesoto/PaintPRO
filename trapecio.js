import { drawLineBresenham, selectedLineBresenham } from './lineaBresenham.js';

export function drawTrapezoid(ctx, startX, startY, x, y, stroke, angle) {
    if (angle > 0) {
        // Calcular el centro del trapecio
        var center = calculateTrapezoidCenter(startX, startY, x, y);

        // Calcular las coordenadas de los vértices del trapecio en relación con su centro
        var topLeft = { x: startX - center.x, y: startY - center.y };
        var topRight = { x: x - center.x, y: startY - center.y };
        var bottomRight = { x: x + (x - startX) / 2 - center.x, y: y - center.y };
        var bottomLeft = { x: startX - (x - startX) / 2 - center.x, y: y - center.y };

        // Aplicar la rotación a cada vértice del trapecio
        var rotatedTopLeft = rotatePoint(topLeft.x, topLeft.y, 0, 0, angle);
        var rotatedTopRight = rotatePoint(topRight.x, topRight.y, 0, 0, angle);
        var rotatedBottomRight = rotatePoint(bottomRight.x, bottomRight.y, 0, 0, angle);
        var rotatedBottomLeft = rotatePoint(bottomLeft.x, bottomLeft.y, 0, 0, angle);

        // Trasladar las coordenadas rotadas de vuelta al sistema de coordenadas original
        rotatedTopLeft.x += center.x;
        rotatedTopLeft.y += center.y;
        rotatedTopRight.x += center.x;
        rotatedTopRight.y += center.y;
        rotatedBottomRight.x += center.x;
        rotatedBottomRight.y += center.y;
        rotatedBottomLeft.x += center.x;
        rotatedBottomLeft.y += center.y;

        // Dibujar el trapecio girado alrededor de su centro
        drawLineBresenham(ctx, Math.round(rotatedTopLeft.x), Math.round(rotatedTopLeft.y), Math.round(rotatedTopRight.x), Math.round(rotatedTopRight.y), stroke); // Borde superior
        drawLineBresenham(ctx, Math.round(rotatedTopRight.x), Math.round(rotatedTopRight.y), Math.round(rotatedBottomRight.x), Math.round(rotatedBottomRight.y), stroke); // Borde derecho
        drawLineBresenham(ctx, Math.round(rotatedBottomRight.x), Math.round(rotatedBottomRight.y), Math.round(rotatedBottomLeft.x), Math.round(rotatedBottomLeft.y), stroke); // Borde inferior
        drawLineBresenham(ctx, Math.round(rotatedBottomLeft.x), Math.round(rotatedBottomLeft.y), Math.round(rotatedTopLeft.x), Math.round(rotatedTopLeft.y), stroke); // Borde izquierdo

    } else {
        var topLeftX = startX;
        var topLeftY = startY;
        var topRightX = x;
        var bottomRightX = x + (x - startX) / 2;
        var bottomRightY = y;
        var bottomLeftX = startX - (x - startX) / 2;

        drawLineBresenham(ctx, Math.round(topLeftX), Math.round(topLeftY), Math.round(topRightX), Math.round(topLeftY), stroke); // Borde superior
        drawLineBresenham(ctx, Math.round(topRightX), Math.round(topLeftY), Math.round(bottomRightX), Math.round(bottomRightY), stroke); // Borde derecho
        drawLineBresenham(ctx, Math.round(bottomRightX), Math.round(bottomRightY), Math.round(bottomLeftX), Math.round(bottomRightY), stroke); // Borde inferior
        drawLineBresenham(ctx, Math.round(bottomLeftX), Math.round(bottomRightY), Math.round(topLeftX), Math.round(topLeftY), stroke); // Borde izquierdo
    }
}

export function selectedTrapezoid(ctx, startX, startY, x, y, stroke, px, py, angle) {
    if (angle > 0) {
        // Calcular el centro del trapecio
        var center = calculateTrapezoidCenter(startX, startY, x, y);

        // Calcular las coordenadas de los vértices del trapecio en relación con su centro
        var topLeft = { x: startX - center.x, y: startY - center.y };
        var topRight = { x: x - center.x, y: startY - center.y };
        var bottomRight = { x: x + (x - startX) / 2 - center.x, y: y - center.y };
        var bottomLeft = { x: startX - (x - startX) / 2 - center.x, y: y - center.y };

        // Aplicar la rotación a cada vértice del trapecio
        var rotatedTopLeft = rotatePoint(topLeft.x, topLeft.y, 0, 0, angle);
        var rotatedTopRight = rotatePoint(topRight.x, topRight.y, 0, 0, angle);
        var rotatedBottomRight = rotatePoint(bottomRight.x, bottomRight.y, 0, 0, angle);
        var rotatedBottomLeft = rotatePoint(bottomLeft.x, bottomLeft.y, 0, 0, angle);

        // Trasladar las coordenadas rotadas de vuelta al sistema de coordenadas original
        rotatedTopLeft.x += center.x;
        rotatedTopLeft.y += center.y;
        rotatedTopRight.x += center.x;
        rotatedTopRight.y += center.y;
        rotatedBottomRight.x += center.x;
        rotatedBottomRight.y += center.y;
        rotatedBottomLeft.x += center.x;
        rotatedBottomLeft.y += center.y;

        // Dibujar el trapecio girado alrededor de su centro
        if (selectedLineBresenham(ctx, Math.round(rotatedTopLeft.x), Math.round(rotatedTopLeft.y), Math.round(rotatedTopRight.x), Math.round(rotatedTopRight.y), stroke, px, py) || // Borde superior
            selectedLineBresenham(ctx, Math.round(rotatedTopRight.x), Math.round(rotatedTopRight.y), Math.round(rotatedBottomRight.x), Math.round(rotatedBottomRight.y), stroke, px, py) || // Borde derecho
            selectedLineBresenham(ctx, Math.round(rotatedBottomRight.x), Math.round(rotatedBottomRight.y), Math.round(rotatedBottomLeft.x), Math.round(rotatedBottomLeft.y), stroke, px, py) || // Borde inferior
            selectedLineBresenham(ctx, Math.round(rotatedBottomLeft.x), Math.round(rotatedBottomLeft.y), Math.round(rotatedTopLeft.x), Math.round(rotatedTopLeft.y), stroke, px, py)) { // Borde izquierdo
            return true;
        }



    } else {


        var topLeftX = startX;
        var topLeftY = startY;
        var topRightX = x;
        var bottomRightX = x + (x - startX) / 2;
        var bottomRightY = y;
        var bottomLeftX = startX - (x - startX) / 2;

        if (selectedLineBresenham(ctx, Math.round(topLeftX), Math.round(topLeftY), Math.round(topRightX), Math.round(topLeftY), stroke, px, py) ||
            selectedLineBresenham(ctx, Math.round(topRightX), Math.round(topLeftY), Math.round(bottomRightX), Math.round(bottomRightY), stroke, px, py) ||
            selectedLineBresenham(ctx, Math.round(bottomRightX), Math.round(bottomRightY), Math.round(bottomLeftX), Math.round(bottomRightY), stroke, px, py) ||
            selectedLineBresenham(ctx, Math.round(bottomLeftX), Math.round(bottomRightY), Math.round(topLeftX), Math.round(topLeftY), stroke, px, py)
        ) {
            //console.log("Trapecio seleccionado")
            return true;
        }
    }
}

function rotatePoint(x, y, x1, y1, angle) {
    var newX = (x - x1) * Math.cos(angle) - (y - y1) * Math.sin(angle) + x1;
    var newY = (x - x1) * Math.sin(angle) + (y - y1) * Math.cos(angle) + y1;
    return { x: newX, y:  newY  };    
}

function calculateTrapezoidCenter(startX, startY, x, y) {
    var centerX = (startX + x + (x - startX) / 2) / 2;
    var centerY = (startY + y) / 2;
    return { x: centerX, y: centerY };
}