export default class Canvas {
    constructor(canvasElement, canvasParentElement) {
      this.canvasDOMElement = canvasElement;
      this.canvasDOMParent = canvasParentElement;
    }
  
    resizeCanvas() {
      if (
        this.canvasDOMParent.offsetWidth > 600 &&
        this.canvasDOMParent.offsetHeight > 500
      ) {
        this.canvasDOMElement.width = this.canvasDOMParent.offsetWidth - 200;
        this.canvasDOMElement.height = this.canvasDOMParent.offsetHeight - 200;
      } else {
        this.canvasDOMElement.width = this.canvasDOMParent.offsetWidth;
        this.canvasDOMElement.height = this.canvasDOMParent.offsetHeight;
      }
    }
  }
  