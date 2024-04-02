// Shape radio listener
// Update selected shape
shapeRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
        if (radio.checked) {
            selectedShape = radio.value;
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mouseup', onMouseUp);
            canvas.removeEventListener('mousemove', onMouseMove);
            console.log("Shape yang terpilih:", selectedShape);
            if (selectedShape == "line"){
              canvas.addEventListener('click', lineListener);
            }
        }
    });
});

// Mouse listener current coordinates
var currX, currY;
canvas.addEventListener('mousemove', function(event) {
  var rect = canvas.getBoundingClientRect();
  var xPixel = event.clientX - rect.left;
  var yPixel = event.clientY - rect.top;

  currX = (xPixel / canvas.width) * 2 - 1;
  currY = ((canvas.height - yPixel) / canvas.height) * 2 - 1;
});

// Dragging handler
var isDragging = false;
var initialX, initialY;

function findClosestPointIndex(x, y) {
    var closestLine = -1;
    var closestIndex = -1;
    var closestDistance = Infinity;
  
    for (var i = 0; i < linePositions.length; i++) {
        var distance = Math.sqrt((x - linePositions[i][0].x) ** 2 + (y - linePositions[i][0].y) ** 2);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestLine = i;
            closestIndex = 0;
        }
        distance = Math.sqrt((x - linePositions[i][1].x) ** 2 + (y - linePositions[i][1].y) ** 2);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestLine = i;
            closestIndex = 1;
        }
    }
    return {closestLine: closestLine, closestIndex: closestIndex};
  }

// Selection tool listener
selectionToolButton.addEventListener("click", function(){
    selectedShape = null;
    shapeRadios.forEach(function(radio) {
      radio.checked = false;
    });
    canvas.removeEventListener('click', lineListener);
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
    var res = findClosestPointIndex(x, y);
    selectedLine = res.closestLine;
    selectedIndex = res.closestIndex;
    console.log("selected line: ", selectedLine);
    console.log("selected index: ", selectedIndex);
    if (selectedLine !== -1) {
        isDragging = true;
        
        // Print coordinates and index
        console.log("Clicked line index:", selectedLine);
        console.log("Coordinates:", linePositions[selectedLine][selectedIndex]);
    }
    if (selectedShape === null) {
        isDragging = true;
        initialX = event.clientX;
        initialY = event.clientY;
    }
}

function onMouseMove(event) {
if (isDragging) {
    linePositions[selectedLine][selectedIndex].x = currX;
    linePositions[selectedLine][selectedIndex].y = currY;
    
    linePositions.forEach(function(element) {
    drawLine(element);
    });
    }
}

function onMouseUp(event) {
    isDragging = false;
}

// Clear canvas listener
clearCanvasButton.addEventListener("click", function(){
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    linePositions = [];
});