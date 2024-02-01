var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
function drawCircle(centerX, centerY, radius) {
    let x = radius;
    let y = 0;
    let decisionOver2 = 1 - x;   // Inicialización de la decisión del punto (el primer punto siempre está en el octeto superior derecho)

    while (y <= x) {
        // Dibuja el pixel en cada octeto
        drawPixel(centerX + x, centerY - y);
        drawPixel(centerX - x, centerY - y);
        drawPixel(centerX + x, centerY + y);
        drawPixel(centerX - x, centerY + y);
        drawPixel(centerX + y, centerY - x);
        drawPixel(centerX - y, centerY - x);
        drawPixel(centerX + y, centerY + x);
        drawPixel(centerX - y, centerY + x);

        y++;

        // Actualiza la decisión según el algoritmo del punto medio
        if (decisionOver2 <= 0) {
            decisionOver2 += 2 * y + 1;
        } else {
            x--;
            decisionOver2 += 2 * (y - x) + 1;
        }
    }
}

function drawPixel(x, y) {
    ctx.fillRect(x, y, 2, 2); // Dibuja el píxel
}
canvas.addEventListener("mousedown", function (event) {
    startX = event.clientX - canvas.getBoundingClientRect().left;
    startY = event.clientY - canvas.getBoundingClientRect().top;
});

canvas.addEventListener("mouseup", function (event) {

    var endX = event.clientX - canvas.getBoundingClientRect().left;
    var endY = event.clientY - canvas.getBoundingClientRect().top;
    const deltax = Math.abs(endX - startX);
    const deltay = Math.abs(endY - startY);
    const radius = Math.sqrt((deltax * deltax) + (deltay * deltay));
    drawCircle(startX, startY, radius)
});