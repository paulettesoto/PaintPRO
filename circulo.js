import { drawPixel, selectedLineBresenham } from './lineaBresenham.js';
// Función para dibujar un punto en un octante y reflejarlo en los otros siete octantes
function drawCirclePoints(ctx, x0, y0, x, y, stroke) {
    // Dibujar el punto en el octante
    drawPixel(ctx, x0 + x, y0 + y, stroke);
    // Reflejar en los otros siete octantes
    drawPixel(ctx, x0 + y, y0 + x, stroke);
    drawPixel(ctx, x0 + y, y0 - x, stroke);
    drawPixel(ctx, x0 + x, y0 - y, stroke);
    drawPixel(ctx, x0 - x, y0 - y, stroke);
    drawPixel(ctx, x0 - y, y0 - x, stroke);
    drawPixel(ctx, x0 - y, y0 + x, stroke);
    drawPixel(ctx, x0 - x, y0 + y, stroke);
}

// Función para dibujar un círculo a partir de un octeto (x, y)
export function drawCircleBresenham(ctx, x0, y0, radius, stroke) {
    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;

    while (x <= y) {
        drawCirclePoints(ctx, x0, y0, x, y, stroke);
        x++;
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
        drawCirclePoints(ctx, x0, y0, x, y, stroke);
    }
}

function selectedCirclePoints(ctx, x0, y0, x, y, stroke, px, py) {

    var x1 = x0 + x;
    var y1 = y0 + y;
    //selectedLineBresenham(ctx, x0 + x, y0 + y, stroke, px, py) 
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        console.log("entre al if");
        return true;
    }
    x1 = x0 + y;
    y1 = y0 + x;
    //selectedLineBresenham(ctx, x0 + y, y0 + x, stroke, px, py) 
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        console.log("entre al if");
        return true;
    }
    x1 = x0 + y;
    y1 = y0 - x;
    //selectedLineBresenham(ctx, x0 + y, y0 - x, stroke, px, py) 
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        console.log("entre al if");
        return true;
    }
    x1 = x0 + x;
    y1 = y0 - y;
    //selectedLineBresenham(ctx, x0 + x, y0 - y, stroke, px, py) 
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        console.log("entre al if");
        return true;
    }
    x1 = x0 - x;
    y1 = y0 - y;
    //selectedLineBresenham(ctx, x0 - x, y0 - y, stroke, px, py) 
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        console.log("entre al if");
        return true;
    }
    x1 = x0 - y;
    y1 = y0 - x;
    //selectedLineBresenham(ctx, x0 - y, y0 - x, stroke, px, py) 
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        console.log("entre al if");
        return true;
    }
    x1 = x0 - y;
    y1 = y0 + x;
    //selectedLineBresenham(ctx, x0 - y, y0 + x, stroke, px, py) 
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        console.log("entre al if");
        return true;
    }
    x1 = x0 - x;
    y1 = y0 + y;
    //selectedLineBresenham(ctx, x0 - x, y0 + y, stroke, px, py)
    if (x1 >= px - stroke && x1 <= px + stroke && y1 >= py - stroke && y1 <= py + stroke) {
        console.log("entre al if");
        return true;
    }


}

// Función para dibujar un círculo a partir de un octeto (x, y)
export function selectedCircleBresenham(ctx, x0, y0, radius, stroke, px, py) {
    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;

    while (x <= y) {
        if (selectedCirclePoints(ctx, x0, y0, x, y, stroke, px, py)) {
            //console.log("Circulo seleccionado")
            return true;
        }
        x++;
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
        if (selectedCirclePoints(ctx, x0, y0, x, y, stroke, px, py)) {
            //console.log("Circulo seleccionado")
            return true;
        }
    }
}