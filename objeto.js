// Importar las funciones necesarias de cada módulo
import { drawLineBresenham } from './lineaBresenham.js';
import { drawSquare } from './cuadrado.js';
import { drawCircleBresenham } from './circulo.js';
import { drawRectangle } from './rectangulo.js';
import { drawEllipse } from './elipse.js';
import { drawPolygon } from './poligonos.js';

// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var formasDibujadas = [];

// Manejar eventos de dibujo (mousedown, mousemove, mouseup)
var startX, startY, figura, mouseX, mouseY, radiusP, initialAngle;
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
    } else {
        startX = Math.round(event.clientX - rect.left);
        startY = Math.round(event.clientY - rect.top);
    }

    isDrawing = true;
});

canvas.addEventListener("mousemove", function(event) {
    if (!isDrawing) return;

    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    // Limpiar el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibujar todas las figuras almacenadas
    formasDibujadas.forEach(function(forma) {
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
        }
    });

    if (isDrawing) {

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
        initialAngle: initialAngle
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