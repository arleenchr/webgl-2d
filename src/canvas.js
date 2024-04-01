var canvas = document.querySelector("#gl-canvas")
var container = document.getElementById("canvas-container");
var gl = canvas.getContext("webgl");

// HTML element
var selectionToolButton = document.getElementById("select-tool-button");
var clearCanvasButton = document.getElementById("clear-canvas-button");
var deleteVertexButton = document.getElementById("delete-vertex-button")
var shapeRadios = document.querySelectorAll('input[name="shape"]');
var importButton = document.getElementById("import-button")
var saveButton = document.getElementById("save-button")
var colorPicker = document.getElementById("color")

// Shape selection
var selectedShape;
// Color selection
var currColorVal = colorPicker.value

if (!gl){
    console.error("Unable to initialize WebGL.")
}
else{
    console.log("Initialize successfull.")
}

// Mouse listener current coordinates
var currX, currY;
canvas.addEventListener('mousemove', function(event) {
  var rect = canvas.getBoundingClientRect();
  var xPixel = event.clientX - rect.left;
  var yPixel = event.clientY - rect.top;

  currX = (xPixel / canvas.width) * 2 - 1;
  currY = ((canvas.height - yPixel) / canvas.height) * 2 - 1;
});

// Selection tool listener
selectionToolButton.addEventListener("click", function(){
  console.log("selection tool clicked");
  selectedShape = null;
  shapeRadios.forEach(function(radio) {
    radio.checked = false;
  });
  canvas.removeEventListener('click', lineListener);
  canvas.addEventListener('mousedown', onMouseDown);
})

function onMouseDown(event) {
  // Convert mouse coordinates to WebGL coordinates
  var rect = canvas.getBoundingClientRect();
  var xPixel = event.clientX - rect.left;
  var yPixel = event.clientY - rect.top;
  var x = (xPixel / canvas.width) * 2 - 1;
  var y = ((canvas.height - yPixel) / canvas.height) * 2 - 1;

  // Find the closest point to the mouse click
  selectedPointIndex = findClosestPointIndex(x, y);

  if (selectedPointIndex !== -1) {
      isDragging = true;
      
      // Print coordinates and index
      console.log("Clicked point index:", selectedPointIndex);
      console.log("Coordinates:", linePositions[selectedPointIndex]);
  }
}

// Clear canvas listener
clearCanvasButton.addEventListener("click", function(){
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  linePositions = [];
});

// Update selected shape
shapeRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
        if (radio.checked) {
            selectedShape = radio.value;
            canvas.removeEventListener('mousedown', onMouseDown);
            console.log("Shape yang terpilih:", selectedShape);
            if (selectedShape == "line"){
              canvas.addEventListener('click', lineListener);
            }
        }
    });
});

function createShader(gl, type, source) {
    // vertex shader source code
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
var vertexShaderSource = 
'attribute vec3 coordinates;\n' +
'void main(void) {\n' +
   ' gl_Position = vec4(coordinates, 1.0);\n' +
   'gl_PointSize = 10.0;\n'+
'}';
var fragmentShaderSource = 'void main(void) {\n' +
' gl_FragColor = vec4(1, 0, 0.5, 1);\n' +
'}';

// create GLSL shaders, upload the GLSL source, compile the shaders
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Link the two shaders into a program
var program = createProgram(gl, vertexShader, fragmentShader);

// look up where the vertex data needs to go.
var positionAttributeLocation = gl.getAttribLocation(program, "coordinates");

// Create a buffer and put three 2d clip space points in it
var positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

function findClosestPointIndex(x, y) {
  var closestIndex = -1;
  var closestDistance = Infinity;

  for (var i = 0; i < linePositions.length; i++) {
      var distance = Math.sqrt((x - linePositions[i][0]) ** 2 + (y - linePositions[i][1]) ** 2);
      if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
      }
  }

  return closestIndex;
}