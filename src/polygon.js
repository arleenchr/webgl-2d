// import { convexHull } from "./convexhull";

var currentPolygon = [];
var countVertex = document.querySelector("#poly-vertices-input");
var vertices = new Array();

function polygonListener(){
    currentPolygon.push(new Vertex(currX, currY, currColorVal));

    if (currentPolygon.length == countVertex){
        canvas.removeEventListener('mousemove', mouseMoveHandlerPolygon);

        for (let i = 0; i < currentPolygon.length; i++){
            vertices.push(currentPolygon[i]);
        }

        models.push(new Model('polygon', countVertex, convexHull(vertices), true));
        currentPolygon = [];
        drawAll();
    } else {
        canvas.addEventListener('mousemove', mouseMoveHandlerPolygon);
    }
}

function mouseMoveHandlerPolygon() {
    drawAll();
    vertices.push(new Vertex(currX, currY, currColorVal))
    var temp = new Model('polygon', countVertex, convexHull(vertices), true);
    drawPolygon(temp);
}

function drawAllPolygons(){
    models.filter(model => model.type === 'polygon').forEach(function(element){
        drawPolygon(element);
    });
}

function drawPolygon(element){
    // Draw
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var size = countVertex;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    
    var positions = [];
    var colors = [];
    for (let i = 0; i < element.length; i++){
        positions.push(element.vertices[i].x);
        positions.push(element.vertices[i].y);
        colors.push(element.vertices[i].color[0]);
        colors.push(element.vertices[i].color[1]);
        colors.push(element.vertices[i].color[2]);
        colors.push(1);
    };
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    size = 2 * countVertex;
    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var primitiveType = gl.TRIANGLE_FAN;
    gl.drawArrays(primitiveType, offset, countVertex);
    gl.drawArrays(gl.POINTS, 0, countVertex)
}