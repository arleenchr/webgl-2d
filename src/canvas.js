var canvas = document.querySelector("#gl-canvas")
var container = document.getElementById("canvas-container");
var gl = canvas.getContext("webgl");
var shapeRadios = document.querySelectorAll('input[name="shape"]');
var selectedShape;
// semua posisi line
var linePositions = [];
// vertex yang tercatat, jika sudah 2 akan dipush ke linePositions dan currentLine dihapus
var currentLine = [];

if (!gl){
    console.error("Unable to initialize WebGL.")
}
else{
    console.log("Initialize successfull.")
}

// Update selected shape
shapeRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
        if (radio.checked) {
            selectedShape = radio.value;
            console.log("Shape yang terpilih:", selectedShape);
            while (true){
              lineProcess();
            }
        }
    });
});

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
  
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
  
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

// Get the strings for our GLSL shaders
var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

// create GLSL shaders, upload the GLSL source, compile the shaders
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Link the two shaders into a program
var program = createProgram(gl, vertexShader, fragmentShader);

// look up where the vertex data needs to go.
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// Create a buffer and put three 2d clip space points in it
var positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

var coord1 = null;
var coord2 = null;

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
    linePositions.forEach(function(element) {
      console.log(element);
      drawLine(element);
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
  // gl.clearColor(0, 0, 0, 0);
  // gl.clear(gl.COLOR_BUFFER_BIT);
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
lineListener();