// Importar las funciones necesarias de cada módulo
import { drawLineBresenham, setColor, selectedLineBresenham } from './lineaBresenham.js';
import { drawSquare, selectedSquare } from './cuadrado.js';
import { drawCircleBresenham, selectedCircleBresenham } from './circulo.js';
import { drawRectangle, selectedRectangle } from './rectangulo.js';
import { drawEllipse, selectedEllipse } from './elipse.js';
import { drawPolygon, selectedPolygon } from './poligonos.js';
import { drawRhombus, selectedRhombus } from './rombo.js';
import { drawTrapezoid, selectedTrapezoid } from './trapecio.js';
//import jsPDF from 'jspdf';

// Obtener el lienzo y el contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var formasDibujadas = [];

// Array para almacenar los puntos dibujados
let drawingPoints = [];

// Manejar eventos de dibujo (mousedown, mousemove, mouseup)
var startX, startY, figura, mouseX, mouseY, radiusP, initialAngle, selectedColor, stroke;
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
        drawAll(forma);
    });

    if (isDrawing) {
        setColor(ctx, selectedColor);

        if (figura === "linea") {
            drawLineBresenham(ctx, startX, startY, x, y, stroke);
        } else if (figura === "cuadrado") {
            drawSquare(ctx, startX, startY, Math.abs(x - startX), stroke);
        } else if (figura === "circulo") {
            drawCircleBresenham(ctx, startX, startY, Math.round(Math.sqrt((x - startX) ** 2 + (y - startY) ** 2)), stroke);
        } else if (figura === "rectangulo") {
            drawRectangle(ctx, startX, startY, x - startX, y - startY, stroke);
        } else if (figura === "elipse") {
            drawEllipse(ctx, startX, startY, Math.abs(x - startX), Math.abs(y - startY), stroke);
        } else if (figura === "poligono") {
            mouseX = event.offsetX;
            mouseY = event.offsetY;
            radiusP = Math.sqrt(Math.pow(mouseX - startX, 2) + Math.pow(mouseY - startY, 2));
            initialAngle = Math.atan2(mouseY - startY, mouseX - startX);
            drawPolygon(ctx, numSides, radiusP, startX, startY, initialAngle, stroke);
        } else if (figura === "lapiz") {

            for (let i = 1; i < drawingPoints.length; i++) {

                const startPoint = drawingPoints[i - 1];
                const endPoint = drawingPoints[i];
                //console.log(startPoint, endPoint);

                //console.log(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
                drawLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, stroke);

            }
        } else if (figura === "rombo") {
            drawRhombus(ctx, startX, startY, x, y, stroke);
        } else if (figura === "trapecio") {
            drawTrapezoid(ctx, startX, startY, x, y, stroke);
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
        color: selectedColor,
        stroke: stroke
    };

    // Almacenar la forma dibujada actualmente
    formasDibujadas.push(forma);

    isDrawing = false;
});

function drawAll(forma) {
    //console.log(forma.tipo, forma.color);
    setColor(ctx, forma.color);
    if (forma.tipo === "linea") {
        drawLineBresenham(ctx, forma.startX, forma.startY, forma.endX, forma.endY, forma.stroke);
    } else if (forma.tipo === "cuadrado") {
        drawSquare(ctx, forma.startX, forma.startY, forma.size, forma.stroke);
    } else if (forma.tipo === "circulo") {
        drawCircleBresenham(ctx, forma.startX, forma.startY, forma.radius, forma.stroke);
    } else if (forma.tipo === "rectangulo") {
        drawRectangle(ctx, forma.startX, forma.startY, forma.width, forma.height, forma.stroke);
    } else if (forma.tipo === "elipse") {
        drawEllipse(ctx, forma.startX, forma.startY, forma.a, forma.b, forma.stroke);
    } else if (forma.tipo === "poligono") {
        drawPolygon(ctx, forma.numSides, forma.radiusP, forma.startX, forma.startY, forma.initialAngle, forma.stroke);
    } else if (forma.tipo === "lapiz") {

        for (let i = 1; i < forma.points.length; i++) {

            const startPoint = forma.points[i - 1];
            const endPoint = forma.points[i];

            drawLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, forma.stroke);

        }
    } else if (forma.tipo === "rombo") {
        drawRhombus(ctx, forma.startX, forma.startY, forma.endX, forma.endY, forma.stroke);
    } else if (forma.tipo === "trapecio") {
        drawTrapezoid(ctx, forma.startX, forma.startY, forma.endX, forma.endY, forma.stroke);
    }
}

const imagenes = document.querySelectorAll('.icon');

// Agregar un evento de clic a cada imagen
imagenes.forEach(function(img) {
    img.addEventListener('click', function() {
        // Obtener el valor del atributo data-value de la imagen
        figura = this.getAttribute('data-value');
        console.log(figura)
        if (figura === "seleccion") {
            canvas.addEventListener("click", detectarFiguraSeleccionada);
        } else if (figura == "png") {
            downloadPNG();
        } else if (figura == "nuevo") {
            newCanvas();
        } else if (figura == "moverAtras" && figuraSeleccionada !== null) {
            moveBehind(indiceFiguraSeleccionada);
        } else if (figura == "moverAlFondo" && figuraSeleccionada !== null) {
            moveBottom(indiceFiguraSeleccionada);
        } else if (figura == "moverAdelante" && figuraSeleccionada !== null) {
            moveUp(indiceFiguraSeleccionada);
        } else if (figura == "moverEnfrente" && figuraSeleccionada !== null) {
            moveFront(indiceFiguraSeleccionada);
        } else {
            // Si no es "seleccion", eliminar el evento para detectar la figura seleccionada
            canvas.removeEventListener("click", detectarFiguraSeleccionada);
        }

    });
});

// Obtener el elemento input de color
const colorPicker = document.getElementById('colorPicker');

// Escuchar cambios en el color seleccionado
colorPicker.addEventListener('change', function() {
    selectedColor = colorPicker.value;
});

document.addEventListener('DOMContentLoaded', function() {
    selectedColor = colorPicker.value;
});

// Obtener el elemento select tamaño
const selectSize = document.getElementById('stroke');

// Escuchar cambios
selectSize.addEventListener('change', function() {
    stroke = parseInt(selectSize.value);
});

document.addEventListener('DOMContentLoaded', function() {
    stroke = parseInt(selectSize.value);
});

let figuraSeleccionada = null;
let indiceFiguraSeleccionada = -1;

function detectarFiguraSeleccionada(event) {
    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    // Iterar sobre las formas dibujadas y verificar si el punto (x, y) está dentro de alguna forma
    for (var i = formasDibujadas.length - 1; i >= 0; i--) {
        var forma = formasDibujadas[i];
        if (forma.tipo === "linea") {

            //console.log(selectedLineBresenham(ctx, forma.startX, forma.startY, forma.endX, forma.endY, forma.stroke, x, y));
            if (selectedLineBresenham(ctx, forma.startX, forma.startY, forma.endX, forma.endY, forma.stroke, x, y)) {
                console.log("Linea seleccionada");

                drawAll(forma);
                figuraSeleccionada = forma;
                indiceFiguraSeleccionada = i;
                return
            }

        } else if (forma.tipo === "cuadrado") {

            if (selectedSquare(ctx, forma.startX, forma.startY, forma.size, forma.stroke, x, y)) {
                console.log("Cuadrado seleccionada");

                drawAll(forma);
                figuraSeleccionada = forma;
                indiceFiguraSeleccionada = i;
                return
            }

        } else if (forma.tipo === "circulo") {

            if (selectedCircleBresenham(ctx, forma.startX, forma.startY, forma.radius, forma.stroke, x, y)) {
                console.log("Circulo seleccionada");

                drawAll(forma);
                figuraSeleccionada = forma;
                indiceFiguraSeleccionada = i;
                return
            }

        } else if (forma.tipo === "rectangulo") {

            if (selectedRectangle(ctx, forma.startX, forma.startY, forma.width, forma.height, forma.stroke, x, y)) {
                console.log("Rectangulo seleccionada");

                drawAll(forma);
                figuraSeleccionada = forma;
                indiceFiguraSeleccionada = i;
                return
            }

        } else if (forma.tipo === "elipse") {

            if (selectedEllipse(ctx, forma.startX, forma.startY, forma.a, forma.b, forma.stroke, x, y)) {
                console.log("Elipse seleccionada");

                drawAll(forma);
                figuraSeleccionada = forma;
                indiceFiguraSeleccionada = i;
                return
            }

        } else if (forma.tipo === "poligono") {

            if (selectedPolygon(ctx, forma.numSides, forma.radiusP, forma.startX, forma.startY, forma.initialAngle, forma.stroke, x, y)) {
                console.log("Poligono seleccionada");

                drawAll(forma);
                figuraSeleccionada = forma;
                indiceFiguraSeleccionada = i;
                return
            }

            //} else if (forma.tipo === "lapiz") {


            //    for (let j = 1; j < forma.points.length; j++) {


            //        const startPoint = forma.points[j - 1];
            //        const endPoint = forma.points[j];

            //        if (selectedLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, forma.stroke, x, y)) {
            //            console.log("Mano alzada seleccionada");
            //
            //    drawAll(forma);
            //            figuraSeleccionada = forma;
            //            console.log(figuraSeleccionada);
            //            indiceFiguraSeleccionada = i;
            //            return
            //        }


            //    }

        } else if (forma.tipo === "rombo") {

            if (selectedRhombus(ctx, forma.startX, forma.startY, forma.endX, forma.endY, forma.stroke, x, y)) {
                console.log("Rombo seleccionada");

                drawAll(forma);
                figuraSeleccionada = forma;
                indiceFiguraSeleccionada = i;
                return
            }

        } else if (forma.tipo === "trapecio") {

            if (selectedTrapezoid(ctx, forma.startX, forma.startY, forma.endX, forma.endY, forma.stroke, x, y)) {
                console.log("Linea seleccionada");
                drawAll(forma);
                figuraSeleccionada = forma;
                indiceFiguraSeleccionada = i;
                return
            }

        }
    }
    figuraSeleccionada = null;
}

canvas.addEventListener("mousedown", function(event) {
    if (figuraSeleccionada !== null) {
        canvas.addEventListener("mousemove", moverFigura);
        canvas.style.cursor = "move";
    } else {
        return
    }
});

function moverFigura(event) {
    const rect = canvas.getBoundingClientRect();
    var x, y;
    if (figuraSeleccionada.tipo === "poligono") {
        x = event.offsetX;
        y = event.offsetY;
        mouseX = startX;
        mouseY = startY;
        //} else if (figuraSeleccionada.tipo === "lapiz") {
        //    drawingPoints = []; // Limpiar los puntos dibujados
        //    x = event.clientX - canvas.offsetLeft;
        //    y = event.clientY - canvas.offsetTop;

        //    drawingPoints.push({ x, y });

    } else {
        x = Math.round(event.clientX - rect.left);
        y = Math.round(event.clientY - rect.top);
    }


    // Calcular la diferencia entre la posición actual y la posición anterior
    const diffX = x - figuraSeleccionada.startX;
    const diffY = y - figuraSeleccionada.startY;

    // Actualizar la posición de la figura seleccionada
    figuraSeleccionada.startX = x;
    figuraSeleccionada.startY = y;
    figuraSeleccionada.endX += diffX; // Actualizar endX según la diferencia en x
    figuraSeleccionada.endY += diffY; // Actualizar endY según la diferencia en y

    // Limpiar el lienzo y dibujar todas las figuras actualizadas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    formasDibujadas.forEach(function(forma, index) {
        // Dibujar todas las figuras excepto la figura seleccionada
        if (index !== indiceFiguraSeleccionada) {
            drawAll(forma);
        }
    });

    // Dibujar la figura seleccionada en su nueva posición
    const figura = formasDibujadas[indiceFiguraSeleccionada];
    //console.log(figura);
    setColor(ctx, '#ff0000');
    if (figura.tipo === "linea") {
        drawLineBresenham(ctx, figura.startX, figura.startY, figura.endX, figura.endY, figura.stroke);
    } else if (figura.tipo === "cuadrado") {
        drawSquare(ctx, figura.startX, figura.startY, figura.size, figura.stroke);
    } else if (figura.tipo === "circulo") {
        drawCircleBresenham(ctx, figura.startX, figura.startY, figura.radius, figura.stroke);
    } else if (figura.tipo === "rectangulo") {
        drawRectangle(ctx, figura.startX, figura.startY, figura.width, figura.height, figura.stroke);
    } else if (figura.tipo === "elipse") {
        drawEllipse(ctx, figura.startX, figura.startY, figura.a, figura.b, figura.stroke);
    } else if (figura.tipo === "poligono") {
        drawPolygon(ctx, figura.numSides, figura.radiusP, figura.startX, figura.startY, figura.initialAngle, figura.stroke);
        //} else if (figura.tipo === "lapiz") {
        //    for (let i = 0; i < drawingPoints.length; i++) {
        //        figura.points[i].x += diffX;
        //        figura.points[i].y += diffY;
        //    }
        //    for (let i = 1; i < figura.points.length; i++) {

        //        const startPoint = figura.points[i - 1];
        //        const endPoint = figura.points[i];

        //        drawLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, figura.stroke);

        //    }
    } else if (figura.tipo === "rombo") {
        drawRhombus(ctx, figura.startX, figura.startY, figura.endX, figura.endY, figura.stroke);
    } else if (figura.tipo === "trapecio") {
        drawTrapezoid(ctx, figura.startX, figura.startY, figura.endX, figura.endY, figura.stroke);
    }

}

canvas.addEventListener("mouseup", function(event) {
    if (figuraSeleccionada !== null) {
        canvas.removeEventListener("mousemove", moverFigura);
        figuraSeleccionada = null;
        indiceFiguraSeleccionada = -1;

        canvas.style.cursor = "default";
    }
});

function downloadPNG() {
    const imgData = canvas.toDataURL('image/png');

    // Guardar el vector de figuras en un archivo JSON
    const datosJSON = JSON.stringify(formasDibujadas);
    const blob = new Blob([datosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Crear un enlace para descargar el archivo JSON
    const downloadJSON = document.createElement('a');
    downloadJSON.href = url;
    downloadJSON.download = 'canvas.json';
    document.body.appendChild(downloadJSON);
    downloadJSON.click();
    document.body.removeChild(downloadJSON);

    // Crear un enlace para descargar la imagen
    const downloadPNG = document.createElement('a');
    downloadPNG.href = imgData;
    downloadPNG.download = 'mi-canvas.png';
    document.body.appendChild(downloadPNG);
    downloadPNG.click();
    document.body.removeChild(downloadPNG);

    //guardar PDF
    //const pdf = new jsPDF();

    // Agregar la imagen al PDF
    //pdf.addImage(imgData, 'PNG', 10, 10, 180, 130); // (imagen, formato, x, y, ancho, alto)

    // Guardar el PDF
    //pdf.save('mi_documento.pdf');
}


// Evento al cargar un archivo JSON
document.getElementById('archivoInput').addEventListener('change', function(event) {
    const archivo = event.target.files[0];

    if (archivo && archivo.type === 'application/json') {
        const lector = new FileReader();

        // Evento al cargar el archivo
        lector.onload = function(e) {
            // Limpiar el lienzo
            const formasJSON = JSON.parse(e.target.result);

            // Dibujar las figuras del archivo JSON en el canvas
            formasJSON.forEach(forma => {
                drawAll(forma);
                formasDibujadas.push(forma);
            });
        };

        lector.readAsText(archivo); // Leer el archivo como texto
    }
});

// Función para limpiar el lienzo y el objeto
function newCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    formasDibujadas.length = 0;
}

// Función para mover una figura hacia atrás
function moveBehind(index) {
    // Verificar que el índice esté dentro de los límites del array
    if (index < 1 || index >= formasDibujadas.length) {
        console.log('Indice fuera de rango');
        return;
    }

    // Intercambiar la posición del elemento seleccionado con el elemento anterior
    const temp = formasDibujadas[index - 1];

    formasDibujadas[index - 1] = formasDibujadas[index];
    formasDibujadas[index] = temp;
    formasDibujadas.forEach(forma => {
        drawAll(forma);
    });
}

// Función para mover una figura al fondo
function moveBottom(index) {
    // Verificar que el índice esté dentro de los límites del array
    if (index < 0 || index >= formasDibujadas.length) {
        console.log('Índice fuera de rango');
        return;
    }

    // Remover la figura del índice dado y agregarla al principio del array
    const figura = formasDibujadas.splice(index, 1)[0];
    formasDibujadas.unshift(figura);

    formasDibujadas.forEach(forma => {
        drawAll(forma);
    });
}

// Función para mover una figura una posición hacia arriba
function moveUp(index) {
    // Verificar que el índice esté dentro de los límites del array
    if (index < 1 || index >= formasDibujadas.length) {
        console.log('Índice fuera de rango');
        return;
    }

    // Intercambiar la posición del elemento seleccionado con el elemento anterior
    const temp = formasDibujadas[index - 1];

    formasDibujadas[index - 1] = formasDibujadas[index];
    formasDibujadas[index] = temp;

    formasDibujadas.forEach(forma => {
        drawAll(forma);
    });
}

// Función para mover una figura hasta enfrente
function moveFront(index) {
    // Verificar que el índice esté dentro de los límites del array
    if (index < 0 || index >= formasDibujadas.length - 1) {
        console.log('Índice fuera de rango');
        return;
    }

    // Remover la figura del índice dado y agregarla al final del array
    const figura = formasDibujadas.splice(index, 1)[0];
    formasDibujadas.push(figura);

    formasDibujadas.forEach(forma => {
        drawAll(forma);
    });
}