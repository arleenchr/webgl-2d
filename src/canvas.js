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
var vertexShaderSource = `
  attribute vec3 coordinates;
  attribute vec4 color;

  varying vec4 v_col;

  void main(void) {
    gl_Position = vec4(coordinates, 1.0);
    gl_PointSize = 10.0;

    v_col = color;
  }
`;
var fragmentShaderSource = `
  precision highp float;

  varying vec4 v_col;

  // uniform vec4 color;
  void main(void) {
    gl_FragColor = v_col;
  }
`;

// create GLSL shaders, upload the GLSL source, compile the shaders
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Link the two shaders into a program
var program = createProgram(gl, vertexShader, fragmentShader);

// Retrieve the uniform location for color
var positionAttributeLocation = gl.getAttribLocation(program, "coordinates");
var colorAttributeLocation = gl.getAttribLocation(program, "color");
var positionBuffer = gl.createBuffer();
var colorBuffer = gl.createBuffer();