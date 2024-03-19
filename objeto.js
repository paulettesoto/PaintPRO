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
var startX, startY, figura, mouseX, mouseY, radiusP, initialAngle, selectedColor, stroke, initial;
var isDrawing = false;
var numSides = 7;
initialAngle = 0;
radiusP = 50;
let figuraSeleccionada = null;
let indiceFiguraSeleccionada = -1;
let undoStack = [];
let redoStack = [];
initial = 0;

canvas.addEventListener("mousedown", function(event) {
    var rect = canvas.getBoundingClientRect();
    if (figuraSeleccionada !== null && figura == "escala") {
        startX = Math.round(event.clientX - rect.left);
        startY = Math.round(event.clientY - rect.top);
        canvas.addEventListener("mousemove", resize);
    } else if (figuraSeleccionada !== null && figura === "seleccion" && figuraSeleccionada.tipo !== "lapiz") {
        figura = "mover";
        canvas.addEventListener("mousemove", moverFigura);
        canvas.style.cursor = "move";
    } else {
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
        canvas.addEventListener("mousemove", drawing);
    }
});

function drawing(event) {
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
}

canvas.addEventListener("mouseup", function(event) {
    if (!isDrawing) return;
    if (figuraSeleccionada !== null && figura === "escala") {
        canvas.removeEventListener("mousemove", resize);
        canvas.removeEventListener("mousemove", moverFigura);
        canvas.removeEventListener("mousemove", drawing);
        // Actualizar la figura redimensionada en el arreglo
        registerUndoState();
        formasDibujadas[indiceFiguraSeleccionada] = figuraSeleccionada;
        figuraSeleccionada = null;
        indiceFiguraSeleccionada = -1;
        canvas.removeEventListener("click", detectarFiguraSeleccionada);
    } else if (figuraSeleccionada !== null && figura === "mover" && figura !== "borrar") {
        canvas.removeEventListener("mousemove", moverFigura);
        canvas.removeEventListener("mousemove", resize);
        canvas.removeEventListener("mousemove", drawing);
        registerUndoState();
        formasDibujadas[indiceFiguraSeleccionada] = figuraSeleccionada;
        figuraSeleccionada = null;
        indiceFiguraSeleccionada = -1;
        canvas.style.cursor = "default";
        canvas.removeEventListener("click", detectarFiguraSeleccionada);
    } else {
        if (figura === "seleccion" || figura === "mover" || figura === "escala" || figura === "borrar" || figura === "moverAtras") return;

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
        registerUndoState();

        // Almacenar la forma dibujada actualmente
        formasDibujadas.push(forma);
        //console.log(forma)

        isDrawing = false;
        canvas.removeEventListener("mousemove", drawing);
        canvas.removeEventListener("mousemove", moverFigura);
        canvas.removeEventListener("mousemove", resize);
    }
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

imagenes.forEach(function(img) {
    img.addEventListener('click', function() {
        // Obtener el valor del atributo data-value de la imagen
        figura = this.getAttribute('data-value');
        console.log(figura)
        if (figura === "seleccion") {
            canvas.addEventListener("click", detectarFiguraSeleccionada);
        } else if (figura == "png") {
            canvas.removeEventListener("click", detectarFiguraSeleccionada);
            downloadPNG();
        } else if (figura == "nuevo") {
            canvas.removeEventListener("click", detectarFiguraSeleccionada);
            newCanvas();
        } else if (figura == "moverAtras" && figuraSeleccionada !== null) {
            canvas.removeEventListener("click", detectarFiguraSeleccionada);
            moveBehind(indiceFiguraSeleccionada);
        } else if (figura == "moverAlFondo" && figuraSeleccionada !== null) {
            canvas.removeEventListener("click", detectarFiguraSeleccionada);
            moveBottom(indiceFiguraSeleccionada);
        } else if (figura == "moverAdelante" && figuraSeleccionada !== null) {
            canvas.removeEventListener("click", detectarFiguraSeleccionada);
            moveUp(indiceFiguraSeleccionada);
        } else if (figura == "moverEnfrente" && figuraSeleccionada !== null) {
            canvas.removeEventListener("click", detectarFiguraSeleccionada);
            moveFront(indiceFiguraSeleccionada);
        } else if (figura === "borrar") {
            canvas.removeEventListener("mousemove", drawing);
            canvas.addEventListener("click", detectarFiguraSeleccionada);
        } else {
            canvas.removeEventListener("mousemove", drawing);
            canvas.removeEventListener("click", detectarFiguraSeleccionada);
        }

    });
});


const colorPicker = document.getElementById('colorPicker');

// Escuchar cambios en el color seleccionado
colorPicker.addEventListener('change', function() {
    selectedColor = colorPicker.value;
});

document.addEventListener('DOMContentLoaded', function() {
    selectedColor = colorPicker.value;
});

// Obtener el tamaño
const selectSize = document.getElementById('stroke');

// Escuchar cambios
selectSize.addEventListener('change', function() {
    stroke = parseInt(selectSize.value);
});

document.addEventListener('DOMContentLoaded', function() {
    stroke = parseInt(selectSize.value);
});

function detectarFiguraSeleccionada(event) {
    console.log(formasDibujadas)
    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    // Iterar sobre las formas dibujadas y verificar si el punto (x, y) está dentro de alguna forma
    for (var i = formasDibujadas.length - 1; i >= 0; i--) {
        var forma = formasDibujadas[i];
        if (forma.tipo === "linea") {
            if (selectedLineBresenham(ctx, forma.startX, forma.startY, forma.endX, forma.endY, forma.stroke, x, y)) {
                console.log("Linea seleccionada");

                //drawAll(forma);
                figuraSeleccionada = JSON.parse(JSON.stringify(forma));
                indiceFiguraSeleccionada = i;
                if (figura === "borrar") {
                    deleteShape(indiceFiguraSeleccionada);
                }
                return
            }

        } else if (forma.tipo === "cuadrado") {

            if (selectedSquare(ctx, forma.startX, forma.startY, forma.size, forma.stroke, x, y)) {
                console.log("Cuadrado seleccionada");

                //drawAll(forma);
                figuraSeleccionada = JSON.parse(JSON.stringify(forma));;
                indiceFiguraSeleccionada = i;
                if (figura === "borrar") {
                    deleteShape(indiceFiguraSeleccionada);
                }
                return
            }

        } else if (forma.tipo === "circulo") {

            if (selectedCircleBresenham(ctx, forma.startX, forma.startY, forma.radius, forma.stroke, x, y)) {
                console.log("Circulo seleccionada");

                //drawAll(forma);
                figuraSeleccionada = JSON.parse(JSON.stringify(forma));;
                indiceFiguraSeleccionada = i;
                if (figura === "borrar") {
                    deleteShape(indiceFiguraSeleccionada);
                }
                return
            }

        } else if (forma.tipo === "rectangulo") {

            if (selectedRectangle(ctx, forma.startX, forma.startY, forma.width, forma.height, forma.stroke, x, y)) {
                console.log("Rectangulo seleccionada");

                //drawAll(forma);
                figuraSeleccionada = JSON.parse(JSON.stringify(forma));;
                indiceFiguraSeleccionada = i;
                if (figura === "borrar") {
                    deleteShape(indiceFiguraSeleccionada);
                }
                return
            }

        } else if (forma.tipo === "elipse") {

            if (selectedEllipse(ctx, forma.startX, forma.startY, forma.a, forma.b, forma.stroke, x, y)) {
                console.log("Elipse seleccionada");

                //drawAll(forma);
                figuraSeleccionada = JSON.parse(JSON.stringify(forma));;
                indiceFiguraSeleccionada = i;
                if (figura === "borrar") {
                    deleteShape(indiceFiguraSeleccionada);
                }
                return
            }

        } else if (forma.tipo === "poligono") {

            if (selectedPolygon(ctx, forma.numSides, forma.radiusP, forma.startX, forma.startY, forma.initialAngle, forma.stroke, x, y)) {
                console.log("Poligono seleccionada");

                //drawAll(forma);
                figuraSeleccionada = JSON.parse(JSON.stringify(forma));;
                indiceFiguraSeleccionada = i;
                if (figura === "borrar") {
                    deleteShape(indiceFiguraSeleccionada);
                }
                return
            }

        } else if (forma.tipo === "lapiz") {


            for (let j = 1; j < forma.points.length; j++) {


                const startPoint = forma.points[j - 1];
                const endPoint = forma.points[j];

                if (selectedLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, forma.stroke, x, y)) {
                    console.log("Mano alzada seleccionada");

                    //drawAll(forma);
                    figuraSeleccionada = JSON.parse(JSON.stringify(forma));;
                    indiceFiguraSeleccionada = i;
                    if (figura === "borrar") {
                        deleteShape(indiceFiguraSeleccionada);
                    }
                    return
                }


            }

        } else if (forma.tipo === "rombo") {

            if (selectedRhombus(ctx, forma.startX, forma.startY, forma.endX, forma.endY, forma.stroke, x, y)) {
                console.log("Rombo seleccionada");

                //drawAll(forma);
                figuraSeleccionada = JSON.parse(JSON.stringify(forma));;
                indiceFiguraSeleccionada = i;
                if (figura === "borrar") {
                    deleteShape(indiceFiguraSeleccionada);
                }
                return
            }

        } else if (forma.tipo === "trapecio") {

            if (selectedTrapezoid(ctx, forma.startX, forma.startY, forma.endX, forma.endY, forma.stroke, x, y)) {
                console.log("Trapecio seleccionada");
                //drawAll(forma);
                figuraSeleccionada = JSON.parse(JSON.stringify(forma));;
                indiceFiguraSeleccionada = i;
                if (figura === "borrar") {
                    deleteShape(indiceFiguraSeleccionada);
                }
                return
            }

        }
    }
    figuraSeleccionada = null;
}

function moverFigura(event) {

    if (figura === "mover") {
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
        setColor(ctx, '#ff0000');
        if (figuraSeleccionada.tipo === "linea") {
            drawLineBresenham(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.endX, figuraSeleccionada.endY, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "cuadrado") {
            drawSquare(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.size, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "circulo") {
            drawCircleBresenham(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.radius, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "rectangulo") {
            drawRectangle(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.width, figuraSeleccionada.height, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "elipse") {
            drawEllipse(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.a, figuraSeleccionada.b, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "poligono") {
            drawPolygon(ctx, figuraSeleccionada.numSides, figuraSeleccionada.radiusP, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.initialAngle, figuraSeleccionada.stroke);
            //} else if (figuraSeleccionada.tipo === "lapiz") {
            //    for (let i = 0; i < drawingPoints.length; i++) {
            //        figuraSeleccionada.points[i].x += diffX;
            //        figuraSeleccionada.points[i].y += diffY;
            //    }
            //    for (let i = 1; i < figuraSeleccionada.points.length; i++) {

            //        const startPoint = figuraSeleccionada.points[i - 1];
            //        const endPoint = figuraSeleccionada.points[i];

            //        drawLineBresenham(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, figuraSeleccionada.stroke);

            //    }
        } else if (figuraSeleccionada.tipo === "rombo") {
            drawRhombus(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.endX, figuraSeleccionada.endY, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "trapecio") {
            drawTrapezoid(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.endX, figuraSeleccionada.endY, figuraSeleccionada.stroke);
        }


    }

}

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
    console.log("index", index);
    // Verificar que el índice esté dentro de los límites del array
    if (index < 0 || index >= formasDibujadas.length) {
        console.log('Indice fuera de rango');
        return;
    }
    registerUndoState();
    // Intercambiar la posición del elemento seleccionado con el elemento anterior
    const temp = JSON.parse(JSON.stringify(formasDibujadas[index - 1]));

    formasDibujadas[index - 1] = formasDibujadas[index];
    formasDibujadas[index] = temp;
    formasDibujadas.forEach(forma => {
        drawAll(forma);
    });

    figuraSeleccionada = null;
    canvas.removeEventListener("click", detectarFiguraSeleccionada);

}

// Función para mover una figura al fondo
function moveBottom(index) {
    console.log(index);
    // Verificar que el índice esté dentro de los límites del array
    if (index < 0 || index >= formasDibujadas.length) {
        console.log('Índice fuera de rango');
        return;
    }
    registerUndoState();
    // Remover la figura del índice dado y agregarla al principio del array
    const figura = JSON.parse(JSON.stringify(formasDibujadas.splice(index, 1)[0]));
    formasDibujadas.unshift(figura);

    formasDibujadas.forEach(forma => {
        drawAll(forma);
    });
    figuraSeleccionada = null;
    canvas.removeEventListener("click", detectarFiguraSeleccionada);
}

// Función para mover una figura hacia adelante
function moveUp(index) {
    console.log(index);
    // Verificar que el índice esté dentro de los límites del array
    if (index < 0 || index >= formasDibujadas.length - 1) {
        console.log('Indice fuera de rango');
        return;
    }
    registerUndoState();
    // Intercambiar la posición del elemento seleccionado con el elemento siguiente
    const temp = JSON.parse(JSON.stringify(formasDibujadas[index + 1]));

    formasDibujadas[index + 1] = formasDibujadas[index];
    formasDibujadas[index] = temp;
    formasDibujadas.forEach(forma => {
        drawAll(forma);
    });
    figuraSeleccionada = null;
    canvas.removeEventListener("click", detectarFiguraSeleccionada);
}

// Función para mover una figura hasta enfrente
function moveFront(index) {
    console.log(index);
    // Verificar que el índice esté dentro de los límites del array
    if (index < 0 || index >= formasDibujadas.length - 1) {
        console.log('Índice fuera de rango');
        return;
    }
    registerUndoState();
    // Remover la figura del índice dado y agregarla al final del array
    const figura = JSON.parse(JSON.stringify(formasDibujadas.splice(index, 1)[0]));
    formasDibujadas.push(figura);

    formasDibujadas.forEach(forma => {
        drawAll(forma);
    });
    figuraSeleccionada = null;
    canvas.removeEventListener("click", detectarFiguraSeleccionada);
}

function resize(event) {
    var rect = canvas.getBoundingClientRect();
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);
    var diffX = x - startX;
    var diffY = y - startY;
    // Limpiar el lienzo y dibujar todas las figuras actualizadas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    formasDibujadas.forEach(function(forma, index) {
        // Dibujar todas las figuras excepto la figura seleccionada
        if (index !== indiceFiguraSeleccionada) {
            drawAll(forma);
        }
    });
    if (figuraSeleccionada !== null && figuraSeleccionada.tipo !== "lapiz") {
        if (figuraSeleccionada.tipo === "linea") {
            figuraSeleccionada.endX += diffX;
            figuraSeleccionada.endY += diffY;
            drawLineBresenham(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.endX, figuraSeleccionada.endY, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "cuadrado") {
            var newSize = Math.max(figuraSeleccionada.size + diffX, figuraSeleccionada.size + diffY);
            figuraSeleccionada.size = newSize;
            drawSquare(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.size, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "rectangulo") {
            figuraSeleccionada.width += diffX;
            figuraSeleccionada.height += diffY;
            drawRectangle(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.width, figuraSeleccionada.height, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "circulo") {
            var radius = Math.round(Math.sqrt((x - figuraSeleccionada.startX) ** 2 + (y - figuraSeleccionada.startY) ** 2));
            figuraSeleccionada.radius = radius;
            drawCircleBresenham(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.radius, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "elipse") {
            figuraSeleccionada.a += diffX;
            figuraSeleccionada.b += diffY;
            drawEllipse(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.a, figuraSeleccionada.b, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "poligono") {
            figuraSeleccionada.radiusP = Math.sqrt(diffX ** 2 + diffY ** 2);
            // Calcular el nuevo radioP y el nuevo ángulo inicial
            figuraSeleccionada.radiusP = Math.sqrt(Math.pow(x - figuraSeleccionada.startX, 2) + Math.pow(y - figuraSeleccionada.startY, 2));
            figuraSeleccionada.initialAngle = Math.atan2(y - figuraSeleccionada.startY, x - figuraSeleccionada.startX);
            drawPolygon(ctx, figuraSeleccionada.numSides, figuraSeleccionada.radiusP, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.initialAngle, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "rombo") {
            figuraSeleccionada.endX += diffX;
            figuraSeleccionada.endY += diffY;
            drawRhombus(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.endX, figuraSeleccionada.endY, figuraSeleccionada.stroke);
        } else if (figuraSeleccionada.tipo === "trapecio") {
            figuraSeleccionada.endX += diffX;
            figuraSeleccionada.endY += diffY;
            drawTrapezoid(ctx, figuraSeleccionada.startX, figuraSeleccionada.startY, figuraSeleccionada.endX, figuraSeleccionada.endY, figuraSeleccionada.stroke);
        }
        startX = x;
        startY = y;


    }
}

function deleteShape(index) {
    registerUndoState(); // Registrar el estado actual antes de borrar la forma
    formasDibujadas.splice(index, 1); // Eliminar la forma del arreglo

    // Limpiar el lienzo y dibujar todas las figuras actualizadas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    formasDibujadas.forEach(function(forma) {
        drawAll(forma);
    });
    canvas.removeEventListener("mousemove", drawing);
    figuraSeleccionada = null;

}

// Función para deshacer la última acción
function undoAction() {
    if (undoStack.length > 0) {
        let lastState = undoStack.pop(); // Obtener el último estado del historial
        redoStack.push([...formasDibujadas]); // Agregar el estado actual al historial de rehacer
        formasDibujadas = lastState; // Restaurar el estado anterior
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        formasDibujadas.forEach(function(forma) {
            drawAll(forma);
        });
    }
}

// Función para rehacer la última acción deshecha
function redoAction() {
    if (redoStack.length > 0) {
        let nextState = redoStack.pop(); // Obtener el próximo estado del historial de rehacer
        undoStack.push([...formasDibujadas]); // Agregar el estado actual al historial de deshacer
        formasDibujadas = nextState; // Restaurar el próximo estado
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        formasDibujadas.forEach(function(forma) {
            drawAll(forma);
        });
    }
}

// Función para manejar eventos del teclado
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'z') {
        undoAction(); // Deshacer al presionar Ctrl + Z
    } else if (event.ctrlKey && event.key === 'y') {
        redoAction(); // Rehacer al presionar Ctrl + Y
    }
});

// Función para manejar el evento de clic en el botón de deshacer
document.getElementById('undo').addEventListener('click', function() {
    undoAction(); // Llamar a la función de deshacer al hacer clic en el botón
});

// Función para manejar el evento de clic en el botón de rehacer
document.getElementById('redo').addEventListener('click', function() {
    redoAction(); // Llamar a la función de rehacer al hacer clic en el botón
});

// Función para registrar los cambios en el historial de deshacer antes de realizar una acción
function registerUndoState() {
    undoStack.push([...formasDibujadas]); // Agregar el estado actual al historial de deshacer
    // Limpiar la pila de redoStack
    redoStack = [];
}