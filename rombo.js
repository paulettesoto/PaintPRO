import { drawLineBresenham, selectedLineBresenham } from './lineaBresenham.js';

// Función para dibujar un rombo a partir de su centro y dimensiones
export function drawRhombus(ctx, centerX, centerY, mouseX, mouseY, stroke, angle) {
    if (angle > 0) {
        // Calcular los vértices del rombo
        var vertices = [
            { x: centerX, y: centerY - Math.abs(mouseY - centerY) }, // Punto superior
            { x: centerX + Math.abs(mouseX - centerX), y: centerY }, // Punto derecho
            { x: centerX, y: centerY + Math.abs(mouseY - centerY) }, // Punto inferior
            { x: centerX - Math.abs(mouseX - centerX), y: centerY } // Punto izquierdo
        ];

        // Girar los vértices del rombo
        var rotatedVertices = vertices.map(vertex => rotatePoint(vertex.x, vertex.y, centerX, centerY, angle));

        // Dibujar el rombo con los vértices girados
        for (var i = 0; i < rotatedVertices.length; i++) {
            var startPoint = rotatedVertices[i];
            var endPoint = rotatedVertices[(i + 1) % rotatedVertices.length];
            drawLineBresenham(ctx, Math.round(startPoint.x), Math.round(startPoint.y), Math.round(endPoint.x), Math.round(endPoint.y), stroke);
        }
    } else {

        // Calcular los vértices del rombo
        var vertices = [
            { x: centerX, y: centerY - Math.abs(mouseY - centerY) }, // Punto superior
            { x: centerX + Math.abs(mouseX - centerX), y: centerY }, // Punto derecho
            { x: centerX, y: centerY + Math.abs(mouseY - centerY) }, // Punto inferior
            { x: centerX - Math.abs(mouseX - centerX), y: centerY } // Punto izquierdo
        ];

        // Dibujar el rombo pixel por pixel
        for (var i = 0; i < vertices.length; i++) {
            var startPoint = vertices[i];
            var endPoint = vertices[(i + 1) % vertices.length];
            drawLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, stroke);
        }
    }
}
// Función para dibujar un rombo a partir de su centro y dimensiones
export function selectedRhombus(ctx, centerX, centerY, mouseX, mouseY, stroke, px, py) {
    // Calcular los vértices del rombo
    var vertices = [
        { x: centerX, y: centerY - Math.abs(mouseY - centerY) }, // Punto superior
        { x: centerX + Math.abs(mouseX - centerX), y: centerY }, // Punto derecho
        { x: centerX, y: centerY + Math.abs(mouseY - centerY) }, // Punto inferior
        { x: centerX - Math.abs(mouseX - centerX), y: centerY } // Punto izquierdo
    ];

    // Dibujar el rombo pixel por pixel
    for (var i = 0; i < vertices.length; i++) {
        var startPoint = vertices[i];
        var endPoint = vertices[(i + 1) % vertices.length];
        if (selectedLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, stroke, px, py)) {
            //console.log("Rombo seleccionado")
            return true;
        }
    }
}

function rotatePoint(x, y, x1, y1, angle) {
    var newX = (x - x1) * Math.cos(angle) - (y - y1) * Math.sin(angle) + x1;
    var newY = (x - x1) * Math.sin(angle) + (y - y1) * Math.cos(angle) + y1;
    return { x: newX, y:  newY  };    
}