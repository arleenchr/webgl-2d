var polygonPositions = [];
var currentPolygon = [];
var countVertex = document.querySelector("#poly-vertices-input");

function polygonListener(){
    canvas.addEventListener('click', function() {
        currentPolygon.push(currX, currY);
        if (currentPolygon.length == countVertex){
            canvas.removeEventListener('mousemove', mouseMoveHandler);
            polygonPositions.push(currentPolygon);
            currentPolygon = [];
            polygonPositions.forEach(function(element){
                drawPolygon(element);
            });
        } else {
            canvas.addEventListener('mousemove', mouseMoveHandler);
        }
    });
}

function mouseMoveHandler(event) {
    polygonPositions.forEach(function(element) {
        drawPolygon(element);
    });
    var temp = [currentPolygon[0], currentPolygon[1], currX, currY];
    drawPolygon(temp);
}

function drawPolygon(coords, countVertex){
    var positions = coords;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Draw
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    // var primitiveType = gl.;
    var count = countVertex;
    // gl.drawArrays(primitiveType, offset, count);
}