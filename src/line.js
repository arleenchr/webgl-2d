// LINE
// current vertex to draw, if already 2 vertex, push to models
var currentLine = [];

// LINE LISTENER
// handle vertex when clicked, is active when selectedShape = Line
function lineListener(){
  currentLine.push(new Vertex(currX, currY, currColorVal));
  if (currentLine.length == 2){
    canvas.removeEventListener('mousemove', mouseMoveHandler);
    models.push(new Model('line', 2, new Array(currentLine[0], currentLine[1]), true))
    currentLine = [];
    drawAll();
  }
  else{
    canvas.addEventListener('mousemove', mouseMoveHandler);
  }
}

// DRAWING LINE WHILE DRAG
function mouseMoveHandler() {
  drawAll();
  var temp = new Model('line', 2, new Array(currentLine[0], new Vertex(currX, currY, currColorVal), true))
  drawLine(temp);
}

// DRAWING ALL LINE MODEL
function drawAllLines(){
  models.filter(model => model.type === 'line').forEach(function(element) {
    drawLine(element);
  });
}

// DRAWING ONE LINE
function drawLine(el){
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

  var positions = [
    el.vertices[0].x, el.vertices[0].y,
    el.vertices[1].x, el.vertices[1].y,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  var size = 4;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);

  var colors = [
    el.vertices[0].color[0], el.vertices[0].color[1], el.vertices[0].color[2], 1,
    el.vertices[1].color[0], el.vertices[1].color[1], el.vertices[1].color[2], 1,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
 
  var primitiveType = gl.LINES;
  var count = 2;
  gl.drawArrays(primitiveType, offset, count);
  gl.drawArrays(gl.POINTS, 0, 2);
}