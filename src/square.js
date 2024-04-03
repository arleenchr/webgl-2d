var currSquare = []

function squareListener(){
    currSquare.push(new Vertex(currX,currY,currColorVal))
    if (currSquare.length == 2){
        canvas.removeEventListener('mousemove',mouseMoveHandlerSquare);
        
        coor1 = new Vertex(currSquare[0].x,currY,currColorVal);
        coor2 = new Vertex(currX,currSquare[0].y,currColorVal);
        coor3 = new Vertex(currX,currY,currColorVal);

        console.log(currSquare[0],coor1,coor2,coor3);
        models.push(new Model('square',4,new Array(currSquare[0],coor1,coor2,coor3), true));
        currSquare = [];
        drawAll();
    } else {
        canvas.addEventListener('mousemove', mouseMoveHandlerSquare)
    }
}

function mouseMoveHandlerSquare(){
    drawAll();
    let canvasratio = 1000/625
    // Calculate the change in coordinates
    var deltaX = currX - currSquare[0].x; //x:y = 1000:625
    var deltaY = currY - currSquare[0].y;

    // kuadran 1 dan 3
    if ( (deltaX > 0 && deltaY > 0) || (deltaX < 0 && deltaY < 0)){
        if (Math.abs(deltaX)*(1/canvasratio) > Math.abs(deltaY)) {
            currX = currSquare[0].x + deltaY*(1/canvasratio); // Maintain the same y-coordinate
        } else {
            currY = currSquare[0].y + deltaX*(canvasratio); // Maintain the same x-coordinate
        }
    }

    // kuadran 2 dan 4
    else if ((deltaX < 0 && deltaY > 0)||(deltaX > 0 && deltaY < 0)){
        if (Math.abs(deltaX)*(1/canvasratio) > Math.abs(deltaY)) {
            currX = currSquare[0].x - deltaY*(1/canvasratio); // Maintain the same y-coordinate
        } else {
            currY = currSquare[0].y - deltaX*(canvasratio); // Maintain the same x-coordinate
        }
    }

    coor1 = new Vertex(currSquare[0].x,currY,currColorVal);
    coor2 = new Vertex(currX,currSquare[0].y,currColorVal);
    coor3 = new Vertex(currX,currY,currColorVal)
    var temp = new Model('square',4,new Array(currSquare[0],coor1,coor2,coor3), false);
    drawSquare(temp);
}

function drawAllSquare(){
    models.filter(model => model.type === 'square').forEach(function(element){
        drawSquare(element);
    })
}

function drawSquare(element){
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
