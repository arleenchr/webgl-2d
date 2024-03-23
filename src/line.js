// LINE
// semua posisi line
var linePositions = [];
// vertex yang tercatat, jika sudah 2 akan dipush ke linePositions dan currentLine dihapus
var currentLine = [];

function lineListener(){
    canvas.addEventListener('click', function(event) {
      var xPixel = event.clientX - canvas.getBoundingClientRect().left;
      var yPixel = event.clientY - canvas.getBoundingClientRect().top;
  
      var xClip = (xPixel / canvas.width) * 2 - 1;
      var yClip = ((canvas.height - yPixel) / canvas.height) * 2 - 1;
  
      currentLine.push(xClip, yClip);
  
      if (currentLine.length == 4){
        linePositions.push(currentLine);
        currentLine = [];
      }
      console.log(linePositions);
      linePositions.forEach(function(gl, program, positionAttributeLocation, positionBuffer,element) {
        console.log(element);
        drawLine(gl, program, positionAttributeLocation, positionBuffer,element);
    });
  });
  }
  
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
  }