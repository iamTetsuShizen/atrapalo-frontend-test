export default class Toolbox {
    constructor(canvas) {
      this.canvas = canvas;
      this.context = canvas.getContext("2d");
  
      this.move = [];
      this.history = [];
      this.pointer = 0;
  
      this.brushWeight = 10;
  
      this.canIDraw = false;
      this.canIRecord = false;
    }
  
    drawCanvas(event) {
      if (this.canIDraw) {
        let x = event.offsetX; // with clientX does some error because canvas does not ocupy 100vh/vw.
        let y = event.offsetY;
  
        this.draw(this.context.strokeStyle, this.brushWeight, x, y);
      }
    }
  
    clearCanvas() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    redrawCanvas() {
      this.clearCanvas();
  
      for (let i = 0; i < this.pointer; i++) {
        this.move = this.history[i].move;
  
        let color = this.move[0];
        let weight = this.move[2];
  
        this.move[3].forEach(point => {
          this.draw(color, weight, point[0], point[1]);
        });
        this.context.beginPath();
      }
    }
  
    //DRAW
    draw(color, weight, x, y) {
      this.context.fillStyle = color;
      this.context.strokeStyle = color;
  
      this.context.lineWidth = weight * 2;
  
      this.context.lineTo(x, y);
      this.context.stroke();
      this.context.beginPath();
      this.context.arc(x, y, weight, 0, Math.PI * 2);
      this.context.fill();
  
      this.context.beginPath();
      this.context.moveTo(x, y);
    }
  
    beginDraw(event) {
      this.canIDraw = true;
      this.drawCanvas(event);
    }
  
    endDraw() {
      this.canIDraw = false;
      this.context.beginPath();
    }
  
    //UNDO/REDO
    record(event) {
      if (this.canIRecord) {
        let x = event.offsetX;
        let y = event.offsetY;
  
        this.move.push([x, y]);
      }
    }
  
    startRecord(event) {
      this.canIRecord = true;
      this.record(event);
    }
  
    endRecord() {
      this.canIRecord = false;
  
      this.history.push({
        move: [
          this.context.fillStyle,
          this.context.strokeStyle,
          this.brushWeight,
          this.move
        ]
      });
      this.pointer++;
      this.move = [];
    }
  
    undo() {
      if (this.canUndo()) {
        this.pointer--;
        this.redrawCanvas();
      }
    }
  
    redo() {
      if (this.canRedo()) {
        this.pointer++;
        this.redrawCanvas();
      }
    }
  
    canUndo() {
      return this.pointer !== 0;
    }
  
    canRedo() {
      return this.pointer !== this.history.length;
    }
  
    rewriteHistory() {
      this.history = this.history.slice(0, this.pointer);
    }
  
    //CHANGE COLOR
    changeColor(color) {
      this.context.fillStyle = color;
      this.context.strokeStyle = color;
    }
  
    //CHANGE BRUSH WEIGHT
    changeWeight(weight) {
      if (weight > 0 && weight < 100) this.brushWeight = weight;
    }
  }
  