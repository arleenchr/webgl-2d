/**
 * Returns 0 if a, b, and c are collinear, 1 if clockwise, 2 if counter-clockwise
 * @param {Vertex} a 
 * @param {Vertex} b 
 * @param {Vertex} c 
 */
function convexOrientation(a, b, c){
    // if slope between b and c greater than slope between a and b, then CCW
    // if slope between b and c less than slope between a and b, then CW
    // if slope between b and c equals slope between a and b, then collinear
    let slopeDiff = (c.y - b.y) * (b.x - a.x) - (c.x - b.x) * (b.y - a.y);
    return (slopeDiff == 0) ? 0 : ((slopeDiff < 0) ? 1 : 2);
}

/**
 * Returns convex hull vertices (Jarvis Algorithm)
 * @param {Vertex[]} vertices 
 * @returns Vertex[]
 */
function convexHull(vertices){
    let n = vertices.length;

    if (n < 3) return vertices;
    
    let result = [];

    // find leftmost vertex
    let leftmostIdx = 0;
    for (let i = 0; i < n; i++){
        if (vertices[i].x < vertices[leftmostIdx].x || vertices[i].y < vertices[leftmostIdx].y){
            leftmostIdx = i;
        }
    }

    // start from leftmost vertex, iterate (CCW) until reach the start vertex again.
    let currIdx = leftmostIdx, nextIdx;
    do{
        // add current vertex to result
        result.push(vertices[currIdx]);
    
        // search for next vertex that orientation(currIdx, nextIdx, ...) is counterclockwise 
        nextIdx = (currIdx + 1) % n;
           
        for (let i = 0; i < n; i++){
           // if i is more counterclockwise than current nextIdx, update nextIdx
           if (convexOrientation(vertices[currIdx], vertices[i], vertices[nextIdx]) == 2){
               nextIdx = i;
           }
        }
    
        // nextIdx is now the most CCW to currIdx
        currIdx = nextIdx;
    } while (currIdx != leftmostIdx);

    return result;
}