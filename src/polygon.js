var currentPolygon = [];
var countVertex = document.getElementById("poly-vertices-input").value;
function handleInputChange() {
    countVertex = document.getElementById("poly-vertices-input").value;
}
document.getElementById("poly-vertices-input").addEventListener("change", handleInputChange);

var convexHullVertices = new Array()
var count;

var model = new Model('polygon', 3, [new Vertex(-0.832, 0.28, '000000'), new Vertex(-0.396, 0.18, '000000'), new Vertex(-0.688, 0.6352, '000000')], true)
function cobainPolygon(){
    drawPolygon(model)
}

function polygonListener(){
    if (countVertex < 3){
        alert("vertex count must be greater than 2");
        return;
    }

    currentPolygon.push(new Vertex(currX, currY, currColorVal));

    if (currentPolygon.length == countVertex){
        canvas.removeEventListener('mousemove', mouseMoveHandlerPolygon);

        convexHullVertices.push(...convexHull(currentPolygon));

        models.push(new Model('polygon', countVertex, convexHullVertices, true));
        currentPolygon = [];
        convexHullVertices = [];
        drawAll();
    } else {
        canvas.addEventListener('mousemove', mouseMoveHandlerPolygon);
    }
}

function mouseMoveHandlerPolygon() {
    drawAll();
    count = currentPolygon.length;

    var handlerVertices = new Array();
    var currentPolygonConvexHull = [];
    currentPolygonConvexHull.push(...currentPolygon);
    currentPolygonConvexHull.push(new Vertex(currX, currY, currColorVal));
    currentPolygonConvexHull = convexHull(currentPolygonConvexHull);
    handlerVertices.push(...currentPolygonConvexHull);
    // handlerVertices.push(...currentPolygon);
    // handlerVertices.push(new Vertex(currX, currY, currColorVal));

    var temp = new Model('polygon', count, handlerVertices);
    drawPolygon(temp);
}

function drawAllPolygons(){
    models.filter(model => model.type === 'polygon').forEach(function(element){
        drawPolygon(element);
    });
}

function drawPolygon(element){
    var positions = [];
    var colors = [];
    var verticesHull = convexHull(element.vertices);

    for (let i = 0; i < verticesHull.length; i++){
        positions.push(verticesHull[i].x);
        positions.push(verticesHull[i].y);
        colors.push(verticesHull[i].color[0]);
        colors.push(verticesHull[i].color[1]);
        colors.push(verticesHull[i].color[2]);
        colors.push(verticesHull[i].color[3]);
    };

    // Draw
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);
    
    // Positions
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions), gl.STATIC_DRAW);
    
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Color
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    size = 4;
    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);
    
    gl.enableVertexAttribArray(colorAttributeLocation);

    var primitiveType = element.vertices.length == 2 ? gl.LINES : gl.TRIANGLE_FAN;
    gl.drawArrays(primitiveType, 0, element.vertices.length);
    gl.drawArrays(gl.POINTS, 0, element.vertices.length)
}