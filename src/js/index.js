import * as DOMElements from "./data/DOMElements";


//GLOBAL VARIABLES
const canvas = DOMElements.canvas;
const colors = require("./data/colors.json").colors;
const weights = [2,4,8,10,12,14,16,20];

//CANVAS VARIABLES ?? POSSIBLE OBJECT
let canvasParent = DOMElements.sectionCanvas;

//TOOLBOX VARIABLES
let cx = canvas.getContext("2d");

let move = [];
let history = [];

let overAllHistory = [];
let pointer = 0; // will be ever pointing on overallHistory


//GENERATING PAGE ELEMENTS
colors.forEach(color => { 
    DOMElements.toolboxColorPicker.insertAdjacentHTML("beforeend", `<div data-tool="color" class="toolbox__color-picker--color" style="background-color:${color.hex}"></div>`);
});

weights.forEach(weight => {
    DOMElements.toolboxWeightPicker.insertAdjacentHTML("beforeend", `<button data-tool="weight" data-weight="${weight}"><span>${weight}px</span><div class="toolbox__weight-picker--line" style="border-bottom: ${weight*2}px solid"></div></button>`);
});

//CANVAS SIZING
let resizeCanvas = () => {
    if(canvasParent.offsetWidth > 600 && canvasParent.offsetHeight > 500){
        canvas.width = canvasParent.offsetWidth - 200;
        canvas.height = canvasParent.offsetHeight - 200;
    } else {
        canvas.width = canvasParent.offsetWidth;
        canvas.height = canvasParent.offsetHeight;
    }
}
//Initial resizing ( TODO: maybe using onload addeventlistener to start app??)
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    redrawCanvas(history);
});


//TOOLS
//CANVAS DRAWING
let brushWeight = 10;
let canIDraw = false;
let canIRecord = false;

let drawCanvas = (ev) => {
    if(canIDraw){
        let x = ev.offsetX; // with clientX does some error because canvas does not ocupy 100vh/vw.
        let y = ev.offsetY;

        draw(cx.strokeStyle, brushWeight, x, y);
    }
};

let redrawCanvas = history => {
    history.forEach(element =>{
        let move = element.move;

        let color = move[0];
        let weight = move[2];

        move[3].forEach( point => {
           draw(color,weight, point[0], point[1]);
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
    cx.arc(x, y, weight, 0, Math.PI*2);
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

let startRecord = ev => {
    canIRecord = true;
    record(ev);
};
let record = ev => {
    if(canIRecord) {
        let x = ev.offsetX;
        let y = ev.offsetY;

        move.push([x,y]);
    }
};
let endRecord = () => {
    canIRecord = false;

    history.push({'move': [cx.fillStyle, cx.strokeStyle, brushWeight, move]});
    move = [];
}

canvas.addEventListener('mousedown', ev => {
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


/**
 * 
 * @param string color  // wich we will pass (DOM element).style.backgroundColor
 *  param accepts HEX and RGBA colors
 */
let changeColor =  (color) => { 
    cx.fillStyle = color;
    cx.strokeStyle = color;
};

let changeWeight = weight => {
    if(weight > 0 && weight < 100) brushWeight = weight;
};


//TOOLBOX option picked
DOMElements.toolbox.addEventListener('click', event => {
    if (event.target.getAttribute('data-tool') === 'color') {

        changeColor(event.target.style.backgroundColor);
        
    } else if (event.target.getAttribute('data-tool') === 'weight') {

       changeWeight(event.target.getAttribute('data-weight'));

    }
});