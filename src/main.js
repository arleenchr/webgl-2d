// HTML ELEMENT
var selectionToolButton = document.getElementById("select-tool-button");
var clearCanvasButton = document.getElementById("clear-canvas-button");
var deleteVertexButton = document.getElementById("delete-vertex-button")
var shapeRadios = document.querySelectorAll('input[name="shape"]');
var importButton = document.getElementById("import-button")
var saveButton = document.getElementById("save-button")
var colorPicker = document.getElementById("color")
var coloringToolButton = document.getElementById("coloring-tool-button");

// CURRENT SHAPE SELECTION
var selectedShape;
// CURRENT COLOR VALUE
var currColorVal = colorPicker.value

var models = new Array();

// DRAWING ALL SHAPES
function drawAll(){
    drawAllLines();
}

// REMOVE ALL SHAPE LISTENERS
function removeAllShapeListener(){
    canvas.removeEventListener('click', lineListener);
}