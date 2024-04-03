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

// Fungsi untuk merotasi persegi
function rotateObject(element, angle) {
    // Mendapatkan matriks rotasi
    const rotationMatrix = makeRotationMatrix(angle);

    // Menerapkan matriks rotasi pada matriks model
    for (let i = 0; i < element.vertices.length; i++) {
        const vertex = element.vertices[i];
        const x = vertex.x;
        const y = vertex.y;
        // Mengalikan posisi setiap vertex dengan matriks rotasi
        vertex.x = rotationMatrix[0] * x + rotationMatrix[1] * y;
        vertex.y = rotationMatrix[4] * x + rotationMatrix[5] * y;
    }

    // Menggambar persegi yang sudah dirotasi
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