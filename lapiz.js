// Obtener el contexto del lienzo
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Array para almacenar los puntos dibujados
let drawingPoints = [];

// Objeto para almacenar dibujos completos
let drawings = [];


// Función para dibujar segmento de línea recta entre dos puntos
function drawLine(x0, y0, x1, y1) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        ctx.fillRect(x0, y0, 1, 1);
        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

// Función para dibujar todos los dibujos completos
function drawAllDrawings() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo
    drawings.forEach(drawing => {
        for (let i = 1; i < drawing.length; i++) {
            const startPoint = drawing[i - 1];
            const endPoint = drawing[i];
            console.log(drawing);
            drawLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        }
    });
}

// Manejador de eventos de ratón para dibujar a mano alzada
canvas.addEventListener('mousedown', (event) => {
    drawingPoints = []; // Limpiar los puntos dibujados
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    drawingPoints.push({ x, y });
    canvas.addEventListener('mousemove', drawFreehand);
});

canvas.addEventListener('mouseup', () => {
    // Terminar el trazo y agregar el dibujo completo
    canvas.removeEventListener('mousemove', drawFreehand);
    if (drawingPoints.length > 1) {
        const drawing = drawingPoints.slice(); // Hacer una copia de los puntos dibujados
        drawings.push(drawing); // Agregar el dibujo completo al array de dibujos
    }
});

// Función para dibujar a mano alzada
function drawFreehand(event) {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    drawingPoints.push({ x, y });

    // Dibujar la línea entre los puntos dibujados
    drawAllDrawings();
    for (let i = 1; i < drawingPoints.length; i++) {
        const startPoint = drawingPoints[i - 1];
        const endPoint = drawingPoints[i];
        drawLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }
}

// Dibujar todos los dibujos existentes al cargar la página
drawAllDrawings();