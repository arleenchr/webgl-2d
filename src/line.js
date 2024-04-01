// LINE
// semua posisi line
var linePositions = [];
// vertex yang tercatat, jika sudah 2 akan dipush ke linePositions dan currentLine dihapus
var currentLine = [];

// line listener untuk menghandle klik vertex dan mouselistener ketika menggambar
function lineListener(){
  canvas.addEventListener('click', function() {
    currentLine.push(currX, currY);
    if (currentLine.length == 4){
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
});
}

function mouseMoveHandler(event) {
  linePositions.forEach(function(element) {
    drawLine(element);
});
  var temp = [currentLine[0], currentLine[1], currX, currY];
  drawLine(temp);
}

// fungsi menggambar line
function drawLine(coords){
  var positions = [
  coords[0], coords[1],
  coords[2], coords[3],
  ];
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
  var primitiveType = gl.LINES;
  var count = 2;
  gl.drawArrays(primitiveType, offset, count);
  gl.drawArrays(gl.POINTS, 0, 2);
}