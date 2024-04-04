// HTML ELEMENT
var selectionToolButton = document.getElementById("select-tool-button");
var clearCanvasButton = document.getElementById("clear-canvas-button");
var addVertexButton = document.getElementById("add-vertex-button");
var deleteVertexButton = document.getElementById("delete-vertex-button");
var shapeRadios = document.querySelectorAll('input[name="shape"]');
var importButton = document.getElementById("import-button");
var saveButton = document.getElementById("save-button");
var colorPicker = document.getElementById("color");
var coloringToolButton = document.getElementById("coloring-tool-button");
var selectShapeButton = document.getElementById("select-shape-button");
var rotationButton = document.getElementById("rotation-button");
var rotationSlider = document.getElementById("rotation-slider");
var shearXButton = document.getElementById("shear-x-button")
var shearXSlider = document.getElementById("shear-x-slider")
var shearYButton = document.getElementById("shear-y-button")
var shearYSlider = document.getElementById("shear-y-slider")

addVertexButton.disabled = true;
deleteVertexButton.disabled = true;
rotationButton.disabled = true;
rotationSlider.disabled = true;
shearXButton.disabled = true;
shearXSlider.disabled = true;
shearYButton.disabled = true;
shearYSlider.disabled = true;

// CURRENT SHAPE SELECTION
var selectedShape;
// CURRENT COLOR VALUE
var currColorVal = colorPicker.value;

var models = new Array();

// DRAWING ALL SHAPES
function drawAll(){
    models.forEach(function(element){
        switch (element.type){
            case 'line':
                drawLine(element)
                break
            case 'rect':
                drawRectangle(element)
                break
            case 'square':
                drawRectangle(element)
            case 'polygon':
                drawPolygon(element)
        }
    })
}

// REMOVE ALL SHAPE LISTENERS
function removeAllShapeListener(){
    canvas.removeEventListener('click', lineListener);
    canvas.removeEventListener('click', rectListener);
    canvas.removeEventListener('click', polygonListener);
    canvas.removeEventListener('click', squareListener);
}