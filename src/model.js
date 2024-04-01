class Model{
    /**
     * 
     * @param {string} type 
     * @param {int} vertexCount 
     * @param {Array<Vertex>} vertices 
     * @param {boolean} isCompleted 
     */
    constructor(
        type,
        vertexCount,
        vertices,
        isCompleted
    ){
        this.type = type;
        this.vertexCount = vertexCount;
        this.vertices = vertices;
        this.isCompleted = isCompleted;
    }
}