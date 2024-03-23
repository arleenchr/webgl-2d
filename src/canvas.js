var canvas = document.querySelector("#gl-canvas")
var container = document.getElementById("canvas-container");
var gl = canvas.getContext("webgl");
var shapeRadios = document.querySelectorAll('input[name="shape"]');
var selectedShape;
var clearCanvasButton = document.getElementById("clear-canvas-button");

if (!gl){
    console.error("Unable to initialize WebGL.")
}
else{
    console.log("Initialize successfull.")
}

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
            console.log("Shape yang terpilih:", selectedShape);
            if (selectedShape == "line"){
              lineListener(gl, program, positionAttributeLocation, positionBuffer);
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