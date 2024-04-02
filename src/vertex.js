class Vertex{
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {string} colorhex
     */
    constructor(x, y, colorhex){
        this.x = x;
        this.y = y;
        this.color = this.hexToRGB(colorhex);
    }

    /**
     * Convert hex to RGB
     * @param {string} hex 
     */
    hexToRGB(hex) {
        const r = parseInt(hex.slice(1, 3), 16)/256;
        const g = parseInt(hex.slice(3, 5), 16)/256;
        const b = parseInt(hex.slice(5, 7), 16)/256;

        var col = new Array();
        col.push(r);
        col.push(g);
        col.push(b);
        
        return col;
    }
}