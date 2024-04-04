function makeRotationMatrix(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    return [
        cos, -sin, 0, 0,
        sin, cos, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}

function rotateObject(element, angle) {
    angle *= Math.PI / 180
    const rotationMatrix = makeRotationMatrix(angle);

    // center of shape
    let centerX = 0;
    let centerY = 0;
    for (let i = 0; i < element.vertices.length; i++) {
        centerX += element.vertices[i].x;
        centerY += element.vertices[i].y;
    }
    centerX /= element.vertices.length;
    centerY /= element.vertices.length;

    // translation to center of shape
    for (let i = 0; i < element.vertices.length; i++) {
        element.vertices[i].x -= centerX;
        element.vertices[i].y -= centerY;
    }

    // rotate
    for (let i = 0; i < element.vertices.length; i++) {
        const vertex = element.vertices[i];
        const x = vertex.x;
        const y = vertex.y;
        vertex.x = (x * Math.cos(angle) - y * Math.sin(angle)) * (1000/625);
        vertex.y = (x * Math.sin(angle) + y * Math.cos(angle)) * (1000/625);
        // vertex.x = (rotationMatrix[0] * x + rotationMatrix[1] * y) * (625/1000);
        // vertex.y = (rotationMatrix[4] * x + rotationMatrix[5] * y) * (625/1000);
    }

    // translation to center of shape
    for (let i = 0; i < element.vertices.length; i++) {
        element.vertices[i].x /= (1000/625);
        element.vertices[i].y /= (1000/625);
        element.vertices[i].x += centerX;
        element.vertices[i].y += centerY;
    }

    // draw
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