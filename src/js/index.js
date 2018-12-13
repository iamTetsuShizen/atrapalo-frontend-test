import * as DOMElements from "./data/DOMElements";


console.log(DOMElements);
let canvas = DOMElements.canvas;
let cx = canvas.getContext("2d");
let canvasParent = DOMElements.sectionCanvas;
let toolbox = DOMElements.toolbox;
let colorPicker = DOMElements.toolboxColorPicker;
let weightPicker = DOMElements.toolboxWeightPicker;

let colors = require("./data/colors.json").colors; // <div class="toolbox__color-picker--color" style="background-color:%COLOR%"></div>
let weights = [2,4,8,10,12,14,16,20]; // <span>%SIZE%px</span><div class="toolbox__weight-picker--line" style="border-bottom: %SIZE%px solid white"></div>


console.log(weights);
//GENERATING PAGE ELEMENTS

colors.forEach(color => { 
    colorPicker.insertAdjacentHTML("beforeend", `<div data-tool="color" class="toolbox__color-picker--color" style="background-color:${color.hex}"></div>`);
});

weights.forEach(weight => {
    weightPicker.insertAdjacentHTML("beforeend", `<button data-tool="weight" data-weight="${weight}"><span>${weight}px</span><div class="toolbox__weight-picker--line" style="border-bottom: ${weight}px solid white"></div></button>`);
});

//TOOLBOX MANUVER
toolbox.addEventListener('click', event => {
    if (event.target.getAttribute('data-tool') === 'color') {
        
        changeColor(event.target.style.backgroundColor);
        

    } else if (event.target.getAttribute('data-tool') === 'weight') {

       changeWeight(event.target.getAttribute('data-weight'));

    }
});

//CANVAS SIZING
canvas.width = canvasParent.offsetWidth - 200;
canvas.height = canvasParent.offsetHeight - 200;

window.addEventListener('resize', () => {
    if(canvasParent.offsetWidth > 600 && canvasParent.offsetHeight > 500){
        canvas.width = canvasParent.offsetWidth - 200;
        canvas.height = canvasParent.offsetHeight - 200;
    } else {
        canvas.width = canvasParent.offsetWidth;
        canvas.height = canvasParent.offsetHeight;
    }
});


//CANVAS DRAWING
let brushWeight = 10;
let canIdraw = false;


let draw = (ev) => {
    if(canIdraw){
        let x = ev.offsetX; // with clientX does some error.
        let y = ev.offsetY;

        cx.lineWidth = brushWeight * 2;

        cx.lineTo(x, y);
        cx.stroke();
        cx.beginPath();
        cx.arc(x, y, brushWeight, 0, Math.PI*2);
        cx.fill();

        cx.beginPath();
        cx.moveTo(x, y);
    }
};

let beginDraw = (ev) => {
    canIdraw = true;
    draw(ev);
};

let endDraw = () => {
    canIdraw = false;
    cx.beginPath();
};

canvas.addEventListener('mousedown', beginDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDraw);

//TOOLS
/**
 * 
 * @param string color  // wich we will pass (DOM element).style.backgroundColor
 *  param accepts HEX and RGBA colors
 */
let changeColor =  (color) => { 
    console.log(color);
    cx.fillStyle = color;
    cx.strokeStyle = color;
    console.log(cx);
};

let changeWeight = (weight) => {
    if(weight > 0 && weight < 100) brushWeight = weight;
};
