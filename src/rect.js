var currRect = []

function rectListener(){
    currRect.push(new Vertex(currX,currY,currColorVal))
    if (currRect.length == 2){
        canvas.removeEventListener('mousemove',mouseMoveHandlerRect);
        coor1 = new Vertex(currRect[0].x,currY,currColorVal);
        coor2 = new Vertex(currX,currRect[0].y,currColorVal);
        coor3 = new Vertex(currX,currY,currColorVal);
        models.push(new Model('rect',4,new Array(currRect[0],coor1,coor2,coor3)))
        currRect = [];
        drawAll();
    } else {
        canvas.addEventListener('mousemove', mouseMoveHandlerRect)
    }
}

function mouseMoveHandlerRect(){
    drawAll();
    coor1 = new Vertex(currRect[0].x,currY,currColorVal);
    coor2 = new Vertex(currX,currRect[0].y,currColorVal);
    coor3 = new Vertex(currX,currY,currColorVal);
    var temp = new Model('rect',4,new Array(currRect[0],coor1,coor2,coor3));
    drawRectangle(temp);
}

function drawAllRect(){
    models.filter(model => model.type === 'rect').forEach(function(element){
        drawRectangle(element);
    })
}

function drawRectangle(element){
    // Draw
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);
    
    // Bind position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttributeLocation);
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
   
    var positions = [
        element.vertices[0].x, element.vertices[0].y,
        element.vertices[1].x, element.vertices[1].y,
        element.vertices[2].x, element.vertices[2].y,
        element.vertices[3].x, element.vertices[3].y,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Bind color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(colorAttributeLocation);
    var size = 4;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);

    var colors = [
        element.vertices[0].color[0], element.vertices[0].color[1], element.vertices[0].color[2], 1,
        element.vertices[1].color[0], element.vertices[1].color[1], element.vertices[1].color[2], 1,
        element.vertices[2].color[0], element.vertices[2].color[1], element.vertices[2].color[2], 1,
        element.vertices[3].color[0], element.vertices[3].color[1], element.vertices[3].color[2], 1,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Draw rectangle
    var primitiveType = gl.TRIANGLE_STRIP; // or gl.TRIANGLES
    var count = 4; // Number of vertices
    gl.drawArrays(primitiveType, offset, count);
    gl.drawArrays(gl.POINTS, 0, count);
}
