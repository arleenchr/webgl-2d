/**
 * Returns the cross product of point a and b
 * @param {Vertex} a
 * @param {Vertex} b
 * @return {number} cross product of a and b
 */
function crossProduct(a, b){
    return (a.x * b.y) - (a.y * b.x);
}

/**
 * Returns true if vertex a, b, and c form a convex corner
 * @param {Vertex} a 
 * @param {Vertex} b 
 * @param {Vertex} c 
 * @return {boolean} true if vertex a, b, and c form a convex corner
 */
function isConvex(a, b, c){
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const bc = { x: c.x - b.x, y: c.y - b.y };

    // Convex corner is when the determinant between BA and BC is greater than 0
    return crossProduct(ab, bc) > 0;
}

/**
 * 
 * @param {Vertex} a 
 * @param {Vertex} b 
 * @returns {boolean} true if 
 */
function compareAngles(a, b) {
    if (isConvex(origin, a, b)) {
        return true;
    } else if (convex(origin, b, a)) {
        return false;
    } else {
        const distA = Math.abs(a.x - origin.x) + Math.abs(a.y - origin.y);
        const distB = Math.abs(b.x - origin.x) + Math.abs(b.y - origin.y);
    
        return distA < distB;
    }
}

/**
 * 
 * @param {Array<Vertex>} vertices 
 * @return {Array<Vertex>} array of convex hull vertices
 */
export function convexHull(vertices){
    let n = vertices.length
    
    if (n < 3) { return vertices; }

    // Store the bottom right vertex in vertices[0]
    let indexLowest = 0;
    for (let i = 1; i < n; ++i) {
        if (vertices[i].y < vertices[indexLowest].y && vertices[i].x > vertices[indexLowest].x){
            indexLowest = i;
        }
    }
    // Swap
    [vertices[0], vertices[indexLowest]] = [vertices[indexLowest], vertices[0]];
    origin = vertices[0];

    // Sort the other vertices (without origin)
    vertices.slice(1).sort(compareAngles);

    let stackVertices = []; // stack to find the vertices of convex hull
    stackVertices.push(vertices[0]);
    stackVertices.push(vertices[1]);

    let pointer = 2;
    while (pointer < n) {
        let a = stackVertices[stackVertices.length - 2];
        let b = stackVertices[stackVertices.length - 1];
        let c = vertices[pointer];
        if (convex(a, b, c)){
            // The vertices form a convex corner. (CCW)
            stackVertices.push(c);
            ++pointer;
        } else{
            // The middle point does not lie on the convex hull
            stackVertices.pop();
            if (stackVertices.length < 2){
                stackVertices.push(c);
                ++pointer;
            }
        }
    }

    // If three collinear vertices are found at the end, remove the middle one
    let a = stackVertices[stackVertices.length - 2];
    let b = stackVertices[stackVertices.length - 1];
    let c = stackVertices[0];
    if (!convex(a, b, c)) {
        stackVertices.pop();
    }

    return stackVertices;
}
