// LINE
// semua posisi line
var linePositions = [];
// vertex yang tercatat, jika sudah 2 akan dipush ke linePositions dan currentLine dihapus
var currentLine = [];

// line listener untuk menghandle klik vertex dan mouselistener ketika menggambar
function lineListener(){
  currentLine.push(new Vertex(currX, currY, currColorVal));
  if (currentLine.length == 2){
    canvas.removeEventListener('mousemove', mouseMoveHandler);
    linePositions.push(currentLine);
    currentLine = [];
    linePositions.forEach(function(element) {
      drawLine(element);
  });
  console.log(linePositions)
  }
  else{
    canvas.addEventListener('mousemove', mouseMoveHandler);
  }
}

function mouseMoveHandler(event) {
  linePositions.forEach(function(element) {
    drawLine(element);
});
  var temp = [currentLine[0], new Vertex(currX, currY, currColorVal)];
  drawLine(temp);
}

// fungsi menggambar line
function drawLine(coords){
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

  var positions = [
    coords[0].x, coords[0].y,
    coords[1].x, coords[1].y,
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
    coords[0].color[0], coords[0].color[1], coords[0].color[2], 1,
    coords[1].color[0], coords[1].color[1], coords[1].color[2], 1
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
 
  var primitiveType = gl.LINES;
  var count = 2;
  gl.drawArrays(primitiveType, offset, count);
  gl.drawArrays(gl.POINTS, 0, 2);
}