function shearXObject(element, value) {
    for (let i = 0; i < element.vertices.length; i++) {
        element.vertices[i].x += value * element.vertices[i].y;
    }

    if (element.type == 'line'){
        drawLine(element);
    } else if (element.type == 'rect'){
        drawRect(element);
    } else if (element.type == 'square'){
        drawSquare(element);
    } else {
        drawPolygon(element);
    }
}

function shearYObject(element, value) {
    for (let i = 0; i < element.vertices.length; i++) {
        element.vertices[i].y += value * element.vertices[i].x;
    }
    
    if (element.type == 'line'){
        drawLine(element);
    } else if (element.type == 'rect'){
        drawRect(element);
    } else if (element.type == 'square'){
        drawSquare(element);
    } else {
        drawPolygon(element);
    }
}