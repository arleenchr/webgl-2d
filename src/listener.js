// COLOR SELECTION LISTENER
colorPicker.addEventListener("change", function() {
    currColorVal = colorPicker.value;
});

// SHAPE RADIO LISTENER
shapeRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
        if (radio.checked) {
            selectedShape = radio.value;
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mouseup', onMouseUp);
            canvas.removeEventListener('mousemove', onMouseMove);
            if (selectedShape == "line"){
              removeAllShapeListener();
              canvas.addEventListener('click', lineListener);
            } else if (selectedShape == "rect"){
              removeAllShapeListener();
              canvas.addEventListener('click', rectListener);
            } else if (selectedShape == "square"){
                removeAllShapeListener();
                canvas.addEventListener('click', squareListener);
            } else if (selectedShape == "poly"){
                removeAllShapeListener();
                canvas.addEventListener('click', polygonListener);
                // canvas.addEventListener('click', cobainPolygon);
            }
        }
    });
});

// CURRENT MOUSE COORDINATES LISTENER
var currX, currY;
canvas.addEventListener('mousemove', function(event) {
  var rect = canvas.getBoundingClientRect();
  var xPixel = event.clientX - rect.left;
  var yPixel = event.clientY - rect.top;

  currX = (xPixel / canvas.width) * 2 - 1;
  currY = ((canvas.height - yPixel) / canvas.height) * 2 - 1;
});

// DRAGGING HANDLER LISTENER
var isDragging = false;
var initialX, initialY;
var selectedModel, selectedShape;

// Closest model and vertex index
function findClosestIndexes(x, y) {
    var i_closestModel = -1;
    var i_closestVertex = -1;
    var closestDistance = 0.01;
  
    models.forEach(function(element, i_model){
        element.vertices.forEach(function(vertex, i_vertex){
            var distance = Math.sqrt((x - vertex.x)**2 + (y - vertex.y)**2);
            if (distance < closestDistance){
                closestDistance = distance;
                i_closestModel = i_model;
                i_closestVertex = i_vertex;
            }
        })
    })
    return {i_closestModel: i_closestModel, i_closestVertex: i_closestVertex};
}

// Selection tool listener
selectionToolButton.addEventListener("click", function(){
    selectedShape = null;
    isColoring = false;
    shapeRadios.forEach(function(radio) {
      radio.checked = false;
    });
    removeAllShapeListener();
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
  })

function onMouseDown(event) {
    // Convert mouse coordinates to WebGL coordinates
    var rect = canvas.getBoundingClientRect();
    var xPixel = event.clientX - rect.left;
    var yPixel = event.clientY - rect.top;
    var x = (xPixel / canvas.width) * 2 - 1;
    var y = ((canvas.height - yPixel) / canvas.height) * 2 - 1;

    // Find the closest point to the mouse click
    var res = findClosestIndexes(x, y);
    selectedModel = res.i_closestModel;
    selectedVertex = res.i_closestVertex;
    if (isColoring){
        console.log("not done coloring", currColorVal, models[selectedModel].vertices[selectedVertex].color);
        models[selectedModel].vertices[selectedVertex].changeColorTo(currColorVal);
        console.log(selectedModel, selectedVertex);
        console.log("done coloring", currColorVal, models[selectedModel].vertices[selectedVertex].color);
        drawAll();
    }
    else{
        if (selectedModel !== -1) {
            isDragging = true;
        }
        if (selectedShape === null) {
            isDragging = true;
            initialX = event.clientX;
            initialY = event.clientY;
        }
    }
}

function onMouseMove() {
    if (isDragging && selectedModel != -1) {
        models[selectedModel].vertices[selectedVertex].x = currX;
        models[selectedModel].vertices[selectedVertex].y = currY;
        drawAllLines();
    }
}

function onMouseUp() {
    isDragging = false;
}

// CLEAR CANVAS LISTENER
clearCanvasButton.addEventListener("click", function(){
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    models = [];
});

// SAVE BUTTON LISTENER
saveButton.addEventListener('click', function(){
    var json = JSON.stringify(models);
    downloadJSON(json, '' + '.json');
});

// IMPORT BUTTON LISTENER
var file;
importButton.addEventListener('click', function(){
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function(event) {
        file = event.target.files[0];
        if (file) {
        loadJSON(file).then(models_input => {
            models.push(...models_input);
            drawAll();
        }).catch(error => {
            console.error("Error loading JSON:", error);
        });
        }
    };
    input.click();
});

// COLORING TOOL BUTTON
var isColoring = false;
coloringToolButton.addEventListener('click', function(){
    isColoring = true
    removeAllShapeListener();
    selectedShape = null;
    shapeRadios.forEach(function(radio) {
      radio.checked = false;
    });
    canvas.addEventListener('mousedown', onMouseDown);
})

function onColoring(){

}