// Importar las funciones necesarias de cada módulo
import { drawLineBresenham, setColor } from './lineaBresenham.js';
import { drawSquare } from './cuadrado.js';
import { drawCircleBresenham } from './circulo.js';
import { drawRectangle } from './rectangulo.js';
import { drawEllipse } from './elipse.js';
import { drawPolygon } from './poligonos.js';
import { drawRhombus } from './rombo.js';
import { drawTrapezoid } from './trapecio.js';

// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var formasDibujadas = [];

// Array para almacenar los puntos dibujados
let drawingPoints = [];

// Manejar eventos de dibujo (mousedown, mousemove, mouseup)
var startX, startY, figura, mouseX, mouseY, radiusP, initialAngle, selectedColor;
var isDrawing = false;
var numSides = 7;
initialAngle = 0;
radiusP = 50;

canvas.addEventListener("mousedown", function(event) {
    // Obtener las coordenadas del click
    var rect = canvas.getBoundingClientRect();
    if (figura === "poligono") {
        startX = event.offsetX;
        startY = event.offsetY;
        mouseX = startX;
        mouseY = startY;
        initialAngle = 0;
    } else if (figura === "lapiz") {
        drawingPoints = []; // Limpiar los puntos dibujados

        var x = event.clientX - canvas.offsetLeft;
        var y = event.clientY - canvas.offsetTop;

        drawingPoints.push({ x, y });

    } else {
        startX = Math.round(event.clientX - rect.left);
        startY = Math.round(event.clientY - rect.top);
    }

    isDrawing = true;
});

canvas.addEventListener("mousemove", function(event) {
    if (!isDrawing) return;
    var x, y;

    var rect = canvas.getBoundingClientRect();

    if (figura === "lapiz") {

        x = event.clientX - canvas.offsetLeft;
        y = event.clientY - canvas.offsetTop;

        drawingPoints.push({ x, y });

    } else {
        x = Math.round(event.clientX - rect.left);
        y = Math.round(event.clientY - rect.top);
    }

    // Limpiar el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibujar todas las figuras almacenadas
    formasDibujadas.forEach(function(forma) {
        console.log(forma.tipo, forma.color);
        setColor(ctx, forma.color);
        if (forma.tipo === "linea") {

            drawLineBresenham(ctx, forma.startX, forma.startY, forma.endX, forma.endY);
        } else if (forma.tipo === "cuadrado") {
            drawSquare(ctx, forma.startX, forma.startY, forma.size);
        } else if (forma.tipo === "circulo") {
            drawCircleBresenham(ctx, forma.startX, forma.startY, forma.radius);
        } else if (forma.tipo === "rectangulo") {
            drawRectangle(ctx, forma.startX, forma.startY, forma.width, forma.height);
        } else if (forma.tipo === "elipse") {
            drawEllipse(ctx, forma.startX, forma.startY, forma.a, forma.b);
        } else if (forma.tipo === "poligono") {
            drawPolygon(ctx, forma.numSides, forma.radiusP, forma.startX, forma.startY, forma.initialAngle);
        } else if (forma.tipo === "lapiz") {

            for (let i = 1; i < forma.points.length; i++) {

                const startPoint = forma.points[i - 1];
                const endPoint = forma.points[i];

                drawLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y);

            }
        } else if (forma.tipo === "rombo") {
            drawRhombus(ctx, forma.startX, forma.startY, forma.endX, forma.endY);
        } else if (forma.tipo === "trapecio") {
            drawTrapezoid(ctx, forma.startX, forma.startY, forma.endX, forma.endY);
        }
    });

    if (isDrawing) {
        console.log("nuevo: ", selectedColor);
        setColor(ctx, selectedColor);

        if (figura === "linea") {
            drawLineBresenham(ctx, startX, startY, x, y);
        } else if (figura === "cuadrado") {
            drawSquare(ctx, startX, startY, Math.abs(x - startX));
        } else if (figura === "circulo") {
            drawCircleBresenham(ctx, startX, startY, Math.round(Math.sqrt((x - startX) ** 2 + (y - startY) ** 2)));
        } else if (figura === "rectangulo") {
            drawRectangle(ctx, startX, startY, x - startX, y - startY);
        } else if (figura === "elipse") {
            drawEllipse(ctx, startX, startY, Math.abs(x - startX), Math.abs(y - startY));
        } else if (figura === "poligono") {
            mouseX = event.offsetX;
            mouseY = event.offsetY;
            radiusP = Math.sqrt(Math.pow(mouseX - startX, 2) + Math.pow(mouseY - startY, 2));
            initialAngle = Math.atan2(mouseY - startY, mouseX - startX);
            drawPolygon(ctx, numSides, radiusP, startX, startY, initialAngle);
        } else if (figura === "lapiz") {

            for (let i = 1; i < drawingPoints.length; i++) {

                const startPoint = drawingPoints[i - 1];
                const endPoint = drawingPoints[i];
                console.log(startPoint, endPoint);

                console.log(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
                drawLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y);

            }
        } else if (figura === "rombo") {
            drawRhombus(ctx, startX, startY, x, y);
        } else if (figura === "trapecio") {
            drawTrapezoid(ctx, startX, startY, x, y);
        }
    }
});

canvas.addEventListener("mouseup", function(event) {
    if (!isDrawing) return;

    var rect = canvas.getBoundingClientRect();

    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    //Tamaño cuadrado
    var size = Math.abs(x - startX);
    //Radio del circulo
    var radius = Math.round(Math.sqrt((x - startX) ** 2 + (y - startY) ** 2));
    //Ancho y altura del rectangulo
    var width = x - startX;
    var height = y - startY;
    // Calcular los semiejes de la elipse
    var a = Math.abs(x - startX);
    var b = Math.abs(y - startY);
    // Hacer una copia de los puntos dibujados  

    var points = drawingPoints.slice();

    var forma = {
        tipo: figura,
        startX: startX,
        startY: startY,
        endX: x,
        endY: y,
        size: size,
        radius: radius,
        width: width,
        height: height,
        a: a,
        b: b,
        numSides: numSides,
        radiusP: radiusP,
        initialAngle: initialAngle,
        points: points,
        color: selectedColor
    };

    // Almacenar la forma dibujada actualmente
    formasDibujadas.push(forma);

    isDrawing = false;
});

const imagenes = document.querySelectorAll('.icon');

// Agregar un evento de clic a cada imagen
imagenes.forEach(function(img) {
    img.addEventListener('click', function() {
        // Obtener el valor del atributo data-value de la imagen
        figura = this.getAttribute('data-value');
        console.log(figura)

    });
});

// Obtener el elemento input de color
const colorPicker = document.getElementById('colorPicker');

// Escuchar cambios en el color seleccionado
colorPicker.addEventListener('change', function() {
    selectedColor = colorPicker.value;
});