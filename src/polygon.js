var currentPolygon = [];
var countVertex = document.getElementById("poly-vertices-input").value;
function handleInputChange() {
    countVertex = document.getElementById("poly-vertices-input").value;
    console.log(countVertex); // Log the value to see if it's retrieved correctly
}
document.getElementById("poly-vertices-input").addEventListener("change", handleInputChange);

var vertices = new Array();
var convexHullVertices = new Array()
var count;

function polygonListener(){
    console.log("polygonnnnnnn");
    console.log(countVertex);

    currentPolygon.push(new Vertex(currX, currY, currColorVal));

    if (currentPolygon.length == countVertex){
    // if (currentPolygon.length == 3){
        canvas.removeEventListener('mousemove', mouseMoveHandlerPolygon);

        vertices.push(...currentPolygon);
        // convexHullVertices.push(...convexHull(currentPolygon));

        models.push(new Model('polygon', countVertex, vertices));
        currentPolygon = [];
        vertices = [];
        drawAll();
    } else {
        canvas.addEventListener('mousemove', mouseMoveHandlerPolygon);
    }
    console.log(currentPolygon);
}

function mouseMoveHandlerPolygon() {
    drawAll();
    count = currentPolygon.length;
    vertices.push(new Vertex(currX, currY, currColorVal))
    var temp = new Model('polygon', count, vertices);
    drawPolygon(temp);
}

function drawAllPolygons(){
    models.filter(model => model.type === 'polygon').forEach(function(element){
        drawPolygon(element);
    });
}

function drawPolygon(element){
    console.log("draw polygon")
    var positions = [];
    var colors = [];

    for (let i = 0; i < element.length; i++){
        positions.push(element.vertices[i].x);
        positions.push(element.vertices[i].y);
        colors.push(element.vertices[i].color[0]);
        colors.push(element.vertices[i].color[1]);
        colors.push(element.vertices[i].color[2]);
        colors.push(element.vertices[i].color[3]);
    };

    // Draw
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);
    
    // Positions
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions), gl.STATIC_DRAW);
    
    // count = currentPolygon.length;
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    // gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(element.vertices.map(vertex => [vertex.x, vertex.y]).flat()), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Color
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    size = 4;
    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(element.vertices.flatMap(vertex => vertex.color)), gl.STATIC_DRAW);
    
    gl.enableVertexAttribArray(colorAttributeLocation);

    gl.drawArrays(gl.LINE, 0, element.vertices.length);
    gl.drawArrays(gl.POINTS, 0, element.vertices.length)
}