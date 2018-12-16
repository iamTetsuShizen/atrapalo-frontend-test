//KEEP IN INDEX
import * as DOMElements from "./data/DOMElements";

//GLOBAL VARIABLES
const canvas = DOMElements.canvas;

const colors = require("./data/colors.json").colors;
const weights = [2, 4, 8, 10, 12, 14, 16, 20];


//GENERATING PAGE ELEMENTS
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

//PAGE EVENTS
window.addEventListener("resize", () => {
  resizeCanvas();
  redrawCanvas(history);
});


canvas.addEventListener('mousedown', ev => {
  history = history.slice(0, pointer);
  beginDraw(ev);
  startRecord(ev);
});
canvas.addEventListener('mousemove', ev => {
  drawCanvas(ev);
  record(ev);
});
canvas.addEventListener('mouseup', () => {
  endDraw();
  endRecord();
});
canvas.addEventListener('mouseout', () => {
  endDraw();
  if(canIRecord) {
    endRecord();
  }
});

//TOOLBOX option picked
DOMElements.toolbox.addEventListener("click", event => {
  let targetAttribute = event.target.getAttribute("data-tool");

  if (targetAttribute === "color") {
    changeColor(event.target.style.backgroundColor);
  } else if (targetAttribute === "weight") {
    changeWeight(event.target.getAttribute("data-weight"));
  } else if (targetAttribute === "undo") {
    undo();
  } else if (targetAttribute === "redo") {
    redo();
  }
});









//CANVAS OBJECT
//CANVAS VARIABLES ?? POSSIBLE OBJECT
let canvasParent = DOMElements.sectionCanvas;

//CANVAS SIZING
let resizeCanvas = () => {
  if (canvasParent.offsetWidth > 600 && canvasParent.offsetHeight > 500) {
    canvas.width = canvasParent.offsetWidth - 200;
    canvas.height = canvasParent.offsetHeight - 200;
  } else {
    canvas.width = canvasParent.offsetWidth;
    canvas.height = canvasParent.offsetHeight;
  }
};
//Initial resizing ( TODO: maybe using onload addeventlistener to start app??)
resizeCanvas();




//TOOLBOX OBJECT
//TOOLBOX VARIABLES
let cx = canvas.getContext("2d");

let move = [];
let history = [];
let pointer = 0;

//CANVAS DRAWING
let brushWeight = 10;
let canIDraw = false;
let canIRecord = false;

let drawCanvas = ev => {
  if (canIDraw) {
    let x = ev.offsetX; // with clientX does some error because canvas does not ocupy 100vh/vw.
    let y = ev.offsetY;

    draw(cx.strokeStyle, brushWeight, x, y);
  }
};

let clearCanvas = () => {
  cx.clearRect(0, 0, canvas.width, canvas.height);
};

let redrawCanvas = history => {
  console.log(history);
  clearCanvas();

  history.forEach(element => {
    let move = element.move;

    let color = move[0];
    let weight = move[2];

    move[3].forEach(point => {
      draw(color, weight, point[0], point[1]);
    });
    cx.beginPath();
  });
};

let draw = (color, weight, x, y) => {
  cx.fillStyle = color;
  cx.strokeStyle = color;
  cx.lineWidth = weight * 2;

  cx.lineTo(x, y);
  cx.stroke();
  cx.beginPath();
  cx.arc(x, y, weight, 0, Math.PI * 2);
  cx.fill();

  cx.beginPath();
  cx.moveTo(x, y);
};

let beginDraw = ev => {
  canIDraw = true;
  drawCanvas(ev);
};

let endDraw = () => {
  canIDraw = false;
  cx.beginPath();
};

//UNDO/REDO
let startRecord = ev => {
  canIRecord = true;
  record(ev);
};
let record = ev => {
  if (canIRecord) {
    let x = ev.offsetX;
    let y = ev.offsetY;

    move.push([x, y]);
  }
};
let endRecord = () => {
  canIRecord = false;

  history.push({ move: [cx.fillStyle, cx.strokeStyle, brushWeight, move] });
  pointer++;
  move = [];

  console.log(history);
};

let undo = () => {
  if (canUndo()) {
    pointer--;
    redrawCanvas(history.slice(0, pointer));
  }
};

let redo = () => {
  if (canRedo()) {
    pointer++;
    redrawCanvas(history.slice(0, pointer));
  }
};

let canUndo = () => {
  return pointer !== 0;
};

let canRedo = () => {
  return pointer !== history.length;
};


//CHANGE COLOR
let changeColor = color => {
  cx.fillStyle = color;
  cx.strokeStyle = color;
};

//CHANGE BRUSH WEIGHT
let changeWeight = weight => {
  if (weight > 0 && weight < 100) brushWeight = weight;
};
