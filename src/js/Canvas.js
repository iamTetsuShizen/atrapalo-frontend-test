

export class Canvas {

    constructor() {
        this.canvas;
        this.canvasDOMParent;
    }

    resizeCanvas() {
        if (this.canvasDOMParent.offsetWidth > 600 && this.canvasDOMParent.offsetHeight > 500) {
            this.canvas.width = this.canvasDOMParent.offsetWidth - 200;
            this.canvas.height = this.canvasDOMParent.offsetHeight - 200;
        } else {
            this.canvas.width = this.canvasDOMParent.offsetWidth;
            this.canvas.height = this.canvasDOMParent.offsetHeight;
        }
    }
}