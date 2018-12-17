import * as DOMElements from "./data/DOMElements";
import Canvas from "./Canvas";
import Toolbox from "./Toolbox";

//GLOBAL VARIABLES
const canvasObj = new Canvas(DOMElements.canvas, DOMElements.sectionCanvas);
const canvas = canvasObj.canvasDOMElement;

const toolboxObj = new Toolbox(canvas);

const colors = require("./data/colors.json").colors;
const weights = [2, 4, 8, 10, 12, 14, 16, 20];

colors.forEach(color => {
  DOMElements.toolboxColorPicker.insertAdjacentHTML(
    "beforeend",
    `<div data-tool="color" class="toolbox__color-picker--color" style="background-color:${
      color.hex
    }"></div>`
  );
});

weights.forEach(weight => {
  DOMElements.toolboxWeightPicker.insertAdjacentHTML(
    "beforeend",
    `<button data-tool="weight" data-weight="${weight}"><span>${weight}px</span><div class="toolbox__weight-picker--line" style="border-bottom: ${weight *
      2}px solid"></div></button>`
  );
});

canvasObj.resizeCanvas();

window.addEventListener("resize", () => {
  canvasObj.resizeCanvas();
  toolboxObj.redrawCanvas();
});

canvas.addEventListener("mousedown", ev => {
  toolboxObj.rewriteHistory(); // TODO: change to a better name
  toolboxObj.beginDraw(ev);
  toolboxObj.startRecord(ev);
});

canvas.addEventListener("mousemove", ev => {
  toolboxObj.drawCanvas(ev);
  toolboxObj.record(ev);
});

canvas.addEventListener("mouseup", () => {
  toolboxObj.endDraw();
  toolboxObj.endRecord();
});

canvas.addEventListener("mouseout", () => {
  toolboxObj.endDraw();
  if (toolboxObj.canIRecord) {
    toolboxObj.endRecord();
  }
});

DOMElements.toolbox.addEventListener("click", event => {
  let targetAttribute = event.target.getAttribute("data-tool");

  if (targetAttribute === "color") {
    toolboxObj.changeColor(event.target.style.backgroundColor);
  } else if (targetAttribute === "weight") {
    toolboxObj.changeWeight(event.target.getAttribute("data-weight"));
  } else if (targetAttribute === "undo") {
    toolboxObj.undo();
  } else if (targetAttribute === "redo") {
    toolboxObj.redo();
  }
});
