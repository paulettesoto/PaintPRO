// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Función para dibujar la línea
function drawLineBresenham(x0, y0, x1, y1) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    let x = x0;
    let y = y0;

    while (x !== x1 || y !== y1) {
        ctx.fillRect(x, y, 1, 1); // Dibuja el píxel
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
}


canvas.addEventListener("click", function(event) {
    // Obtener las coordenadas del click
    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    if (!canvas.startCoord) {
        // Almacenar las coordenadas de inicio
        canvas.startCoord = {x, y};
    } else {
        // Dibujar la línea y limpiar las coordenadas de inicio
        drawLineBresenham(canvas.startCoord.x, canvas.startCoord.y, x, y);
        canvas.startCoord = null;
    }
});