// COLOR SELECTION LISTENER
colorPicker.addEventListener("change", function() {
    currColorVal = colorPicker.value;
});

// SHAPE RADIO LISTENER
shapeRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
        if (radio.checked) {
            selectedShape = radio.value;
            selectShapeButton.style.backgroundColor = "transparent"
            selectShapeButton.style.color = "#ffffff"
            selectionToolButton.style.backgroundColor = "transparent"
            selectionToolButton.style.color = "#ffffff"
            coloringToolButton.style.backgroundColor = "transparent"
            coloringToolButton.style.color = "#ffffff"
            addVertexButton.style.backgroundColor = "transparent"
            addVertexButton.style.color = "#8c959a"
            addVertexButton.style.borderColor = "#8c959a"
            addVertexButton.disabled = true;
            deleteVertexButton.style.backgroundColor = "transparent"
            deleteVertexButton.style.color = "#ca8484"
            deleteVertexButton.style.borderColor = "#ca8484"
            deleteVertexButton.disabled = true;
            rotationButton.style.backgroundColor = "transparent"
            rotationButton.style.color = "#8c959a"
            rotationButton.style.borderColor = "#8c959a"
            rotationButton.disabled = true;
            rotationSlider.style.backgroundColor = "#777f83"
            rotationSlider.disabled = true;

            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mouseup', onMouseUp);
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mousedown', onTranslation);
            canvas.removeEventListener('mousemove', onTranslationDrag);
            canvas.removeEventListener('mouseup', onTranslationUp);
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
    var closestDistance = 0.1;
  
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
    selectionToolButton.style.backgroundColor = "#ffffff"
    selectionToolButton.style.color = "#525D64"
    selectedShape = null;
    isColoring = false;
    isAddingVertex = false;
    isDeletingVertex = false;
    shapeRadios.forEach(function(radio) {
      radio.checked = false;
    });
    selectShapeButton.style.backgroundColor = "transparent"
    selectShapeButton.style.color = "#ffffff"
    coloringToolButton.style.backgroundColor = "transparent"
    coloringToolButton.style.color = "#ffffff"
    addVertexButton.style.backgroundColor = "transparent"
    addVertexButton.style.color = "#8c959a"
    addVertexButton.style.borderColor = "#8c959a"
    addVertexButton.disabled = true;
    deleteVertexButton.style.backgroundColor = "transparent"
    deleteVertexButton.style.color = "#ca8484"
    deleteVertexButton.style.borderColor = "#ca8484"
    deleteVertexButton.disabled = true;
    rotationButton.style.backgroundColor = "transparent"
    rotationButton.style.color = "#8c959a"
    rotationButton.style.borderColor = "#8c959a"
    rotationButton.disabled = true;
    rotationSlider.style.backgroundColor = "#777f83"
    rotationSlider.disabled = true;
    
    removeAllShapeListener();
    canvas.removeEventListener('mousedown', onTranslation);
    canvas.removeEventListener('mousemove', onTranslationDrag);
    canvas.removeEventListener('mouseup', onTranslationUp);
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

    if (isAddingVertex){
        if (selectedModel == null || selectedModel == -1){
            alert("Select a polygon before add or delete vertex")
        } else if (models[selectedModel].type !== "polygon"){
           alert("Sorry. Add and delete vertex tools are only for polygon shapes")
        } else {
            console.log(selectedModel, models[selectedModel]);
            console.log(x, y);
    
            models[selectedModel].vertexCount++;
            models[selectedModel].vertices.push(new Vertex(x, y, ''));
            models[selectedModel].vertices[models[selectedModel].vertexCount-1].color = models[selectedModel].vertices[models[selectedModel].vertexCount-2].color 
            drawAll();
        }
    }

    // Find the closest point to the mouse click
    var res = findClosestIndexes(x, y);
    selectedModel = res.i_closestModel;
    selectedVertex = res.i_closestVertex;
    if (isColoring){
        models[selectedModel].vertices[selectedVertex].changeColorTo(currColorVal);
        drawAll();
    }  else if (isDeletingVertex){
        if (selectedModel == -1){
            alert("Select a polygon before add or delete vertex")
        } else if (models[selectedModel].type !== 'polygon'){
            alert("Sorry. Add and delete vertex tools are only for polygon shapes")
        } else {
            models[selectedModel].vertexCount--;
            models[selectedModel].vertices.splice(selectedVertex, 1)
            drawAll();
        }
    } else{
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
    if (isDragging && selectedModel != -1 && models[selectedModel].type == "line") {
        models[selectedModel].vertices[selectedVertex].x = currX;
        models[selectedModel].vertices[selectedVertex].y = currY;
    }
    else if (isDragging && selectedModel != -1 && models[selectedModel].type == "rect") {
        models[selectedModel].vertices[selectedVertex].x = currX;
        models[selectedModel].vertices[selectedVertex].y = currY;
        if (selectedVertex == 0){
            models[selectedModel].vertices[1].x = currX;
            models[selectedModel].vertices[2].y = currY;
        }
        else if (selectedVertex == 1){
            models[selectedModel].vertices[0].x = currX;
            models[selectedModel].vertices[3].y = currY;
        }
        else if (selectedVertex == 2){
            models[selectedModel].vertices[3].x = currX;
            models[selectedModel].vertices[0].y = currY;
        }
        else if (selectedVertex == 3){
            models[selectedModel].vertices[2].x = currX;
            models[selectedModel].vertices[1].y = currY;
        }
    }
    else if (isDragging && selectedModel != -1 && models[selectedModel].type == "square") {
        let canvasratio = 1000/625
        // Calculate the change in coordinates
        var i_selected;
        if (selectedVertex == 0){
            i_selected = 3;
        }
        else if(selectedVertex == 1){
            i_selected = 2;
        }
        else if(selectedVertex == 2){
            i_selected = 1;
        }
        else if(selectedVertex == 3){
            i_selected = 0;
        }
        var deltaX = currX - models[selectedModel].vertices[i_selected].x; //x:y = 1000:625
        var deltaY = currY - models[selectedModel].vertices[i_selected].y;
        // kuadran 1 dan 3
        if ((deltaX > 0 && deltaY > 0) || (deltaX < 0 && deltaY < 0)){
            if (Math.abs(deltaX)*(1/canvasratio) > Math.abs(deltaY)) {
                currX = models[selectedModel].vertices[i_selected].x + d
                eltaY*(1/canvasratio); // Maintain the same y-coordinate
            } else {
                currY = models[selectedModel].vertices[i_selected].y + deltaX*(canvasratio); // Maintain the same x-coordinate
            }
        }

        // kuadran 2 dan 4
        else if ((deltaX < 0 && deltaY > 0)||(deltaX > 0 && deltaY < 0)){
            if (Math.abs(deltaX)*(1/canvasratio) > Math.abs(deltaY)) {
                currX = models[selectedModel].vertices[i_selected].x - deltaY*(1/canvasratio); // Maintain the same y-coordinate
            } else {
                currY = models[selectedModel].vertices[i_selected].y - deltaX*(canvasratio); // Maintain the same x-coordinate
            }
        }

        models[selectedModel].vertices[selectedVertex].x = currX;
        models[selectedModel].vertices[selectedVertex].y = currY;
        if (selectedVertex == 0){
            models[selectedModel].vertices[1].x = currX;
            models[selectedModel].vertices[2].y = currY;
        }
        else if (selectedVertex == 1){
            models[selectedModel].vertices[0].x = currX;
            models[selectedModel].vertices[3].y = currY;
        }
        else if (selectedVertex == 2){
            models[selectedModel].vertices[3].x = currX;
            models[selectedModel].vertices[0].y = currY;
        }
        else if (selectedVertex == 3){
            models[selectedModel].vertices[2].x = currX;
            models[selectedModel].vertices[1].y = currY;
        }
    }
    else if (isDragging && selectedModel != -1 && models[selectedModel].type == "polygon") {
        models[selectedModel].vertices[selectedVertex].x = currX;
        models[selectedModel].vertices[selectedVertex].y = currY;
    }
    drawAll();
}

function onMouseUp() {
    isDragging = false;
}

// TRANSLATION TOOL LISTENER
var isDraggingShape = false;
selectShapeButton.addEventListener("click", function(){
    selectShapeButton.style.backgroundColor = "#ffffff"
    selectShapeButton.style.color = "#525D64"
    selectedShape = null;
    isColoring = false;
    isAddingVertex = false;
    isDeletingVertex = false;
    shapeRadios.forEach(function(radio) {
      radio.checked = false;
    });
    removeAllShapeListener();
    coloringToolButton.style.backgroundColor = "transparent"
    coloringToolButton.style.color = "#ffffff"
    selectionToolButton.style.backgroundColor = "transparent"
    selectionToolButton.style.color = "#ffffff"
    addVertexButton.style.borderColor = "#ffffff"
    addVertexButton.style.backgroundColor = "transparent"
    addVertexButton.style.color = "#ffffff"
    addVertexButton.disabled = false;
    deleteVertexButton.style.borderColor = "#F75D5D"
    deleteVertexButton.style.backgroundColor = "transparent"
    deleteVertexButton.style.color = "#F75D5D"
    deleteVertexButton.disabled = false;
    rotationButton.style.backgroundColor = "transparent"
    rotationButton.style.color = "#ffffff"
    rotationButton.style.borderColor = "#ffffff"
    rotationButton.disabled = false;
    rotationSlider.style.backgroundColor = "#dbdee0"
    rotationSlider.disabled = false;

    canvas.addEventListener('mousedown', onTranslation);
    canvas.addEventListener('mousemove', onTranslationDrag);
    canvas.addEventListener('mouseup', onTranslationUp);
})

function onTranslation(){
    selectedModel = -1;
    models.forEach(function(model, index){
        if (model.type == "line"){
            if (isPointInsideLine(model)){
                selectedModel = index;
                isDraggingShape = true;
            }
        }
        else if (model.type == "rect" || model.type == "square"){
            if (isPointInsideSquare(model)){
                selectedModel = index;
                isDraggingShape = true;
            }
        }
        else if (model.type == "polygon"){
            if (isPointInsidePolygon(model)){
                selectedModel = index;
                isDraggingShape = true;
            }
        }
    });
    initialX = currX;
    initialY = currY;
    
    console.log(selectedModel);
}

function onTranslationDrag(){

}

function onTranslationUp(){
    if (isDraggingShape && selectedModel != -1){
        models[selectedModel].vertices.forEach(function(element, index){
            models[selectedModel].vertices[index].x += (currX-initialX);
            models[selectedModel].vertices[index].y += (currY-initialY);
        });
    }
    isDraggingShape = false;
    drawAll();
}

function isPointInsideLine(model) {
    var startPoint = model.vertices[0];
    var endPoint = model.vertices[1];

    var distance = Math.abs((endPoint.y - startPoint.y) * currX - 
                            (endPoint.x - startPoint.x) * currY + 
                            endPoint.x * startPoint.y - 
                            endPoint.y * startPoint.x) / 
                            Math.sqrt((endPoint.y - startPoint.y) ** 2 + 
                            (endPoint.x - startPoint.x) ** 2);

    return distance <= 0.1;
}

function isPointInsideSquare(model) {
    var coor0 = model.vertices[0];
    var coor1 = model.vertices[1];
    var coor2 = model.vertices[2];
    var coor3 = model.vertices[3];

    var minX = Math.min(coor0.x, coor1.x, coor2.x, coor3.x);
    var maxX = Math.max(coor0.x, coor1.x, coor2.x, coor3.x);
    var minY = Math.min(coor0.y, coor1.y, coor2.y, coor3.y);
    var maxY = Math.max(coor0.y, coor1.y, coor2.y, coor3.y);

    return (currX >= minX && currX <= maxX && currY >= minY && currY <= maxY);
}

function isPointInsidePolygon(model) {
    var inside = false;
    for (var i = 0, j = model.vertices.length - 1; i < model.vertices.length; j = i++) {
        var xi = model.vertices[i].x, yi = model.vertices[i].y;
        var xj = model.vertices[j].x, yj = model.vertices[j].y;
        
        var intersect = ((yi > currY) != (yj > currY))
            && (currX < (xj - xi) * (currY - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Add vertex tool listener
var isAddingVertex;
addVertexButton.addEventListener("click", function(){
    console.log("add bng", selectedModel)
    addVertexButton.style.backgroundColor = "#ffffff"
    addVertexButton.style.color = "#525D64"
    isColoring = false;
    isAddingVertex = true;
    isDeletingVertex = false;
    shapeRadios.forEach(function(radio) {
      radio.checked = false;
    });
    deleteVertexButton.style.backgroundColor = "transparent"
    deleteVertexButton.style.color = "#F75D5D"
    removeAllShapeListener();
    canvas.removeEventListener('mousedown', onTranslation);
    canvas.removeEventListener('mousemove', onTranslationDrag);
    canvas.removeEventListener('mouseup', onTranslationUp);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousedown', onMouseDown);
})

// Delete vertex tool listener
var isDeletingVertex;
deleteVertexButton.addEventListener("click", function(){
    console.log("delete bng")
    deleteVertexButton.style.backgroundColor = "#F75D5D"
    deleteVertexButton.style.color = "#ffffff"
    selectedShape = null;
    isColoring = false;
    isAddingVertex = false;
    isDeletingVertex = true;
    shapeRadios.forEach(function(radio) {
      radio.checked = false;
    });
    addVertexButton.style.backgroundColor = "transparent"
    addVertexButton.style.color = "#ffffff"
    removeAllShapeListener();
    canvas.removeEventListener('mousedown', onTranslation);
    canvas.removeEventListener('mousemove', onTranslationDrag);
    canvas.removeEventListener('mouseup', onTranslationUp);
    canvas.addEventListener('mousedown', onMouseDown);
    // canvas.addEventListener('mouseup', onMouseUp);
    // canvas.addEventListener('mousemove', onMouseMove);
})

// ROTATION BUTTON LISTENER
rotationButton.addEventListener("click", function(){
    console.log("rotate bng", selectedModel, rotationSlider.value)
    rotationButton.style.backgroundColor = "#ffffff"
    rotationButton.style.color = "#525D64"
    rotationSlider.value = 0
    isColoring = false;
    isAddingVertex = false;
    isDeletingVertex = false;
    shapeRadios.forEach(function(radio) {
      radio.checked = false;
    });
    deleteVertexButton.style.backgroundColor = "transparent"
    deleteVertexButton.style.color = "#F75D5D"
    removeAllShapeListener();
    canvas.removeEventListener('mousedown', onTranslation);
    canvas.removeEventListener('mousemove', onTranslationDrag);
    canvas.removeEventListener('mouseup', onTranslationUp);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousedown', onMouseDown);
})

rotationSlider.addEventListener("change", function(){
    console.log(rotationSlider.value)
    if (selectedModel == null || selectedModel == -1){
        alert("Select a polygon before add or delete vertex")
    } else {
        rotateObject(models[selectedModel], rotationSlider.value)
        drawAll()
    }
})

// CLEAR CANVAS LISTENER
clearCanvasButton.addEventListener("click", function(){
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    models = [];
    selectShapeButton.style.backgroundColor = "transparent"
    selectShapeButton.style.color = "#ffffff"
    selectionToolButton.style.backgroundColor = "transparent"
    selectionToolButton.style.color = "#ffffff"
    coloringToolButton.style.backgroundColor = "transparent"
    coloringToolButton.style.color = "#ffffff"
    addVertexButton.style.backgroundColor = "transparent"
    addVertexButton.style.color = "#8c959a"
    addVertexButton.style.borderColor = "#8c959a"
    addVertexButton.disabled = true;
    deleteVertexButton.style.backgroundColor = "transparent"
    deleteVertexButton.style.color = "#ca8484"
    deleteVertexButton.style.borderColor = "#ca8484"
    deleteVertexButton.disabled = true;
    rotationButton.style.backgroundColor = "transparent"
    rotationButton.style.color = "#8c959a"
    rotationButton.style.borderColor = "#8c959a"
    rotationButton.disabled = true;
    rotationSlider.style.backgroundColor = "#777f83"
    rotationSlider.disabled = true;
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
    coloringToolButton.style.backgroundColor = "#ffffff"
    coloringToolButton.style.color = "#525D64"
    isColoring = true
    isAddingVertex = false;
    isDeletingVertex = false;
    selectShapeButton.style.backgroundColor = "transparent"
    selectShapeButton.style.color = "#ffffff"
    selectionToolButton.style.backgroundColor = "transparent"
    selectionToolButton.style.color = "#ffffff"
    addVertexButton.style.backgroundColor = "transparent"
    addVertexButton.style.color = "#8c959a"
    addVertexButton.style.borderColor = "#8c959a"
    deleteVertexButton.style.backgroundColor = "transparent"
    deleteVertexButton.style.color = "#ca8484"
    deleteVertexButton.style.borderColor = "#ca8484"
    removeAllShapeListener();
    selectedShape = null;
    shapeRadios.forEach(function(radio) {
      radio.checked = false;
    });
    canvas.addEventListener('mousedown', onMouseDown);
})