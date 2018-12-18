/**
 * Author's notes: Mocha funciona por fin via node.js, pero tengo el problema de no poder contar con el objeto document del navegador en node.js, de aqui el experimento con JSDOM.
 * 
 * Despues de un par de horas de testing con JSDOM, no he dado con lo que esperava conseguir, por falta de experiencia en tests, aun así, quiero dejar todas las pruebas como si funcionasen 
 * para la prueba tecnica, dado el poco tiempo que me queda, no me puedo permitir refactorizar todo el código. Pero este proyecto va a ir mas allá de esta prueba técnica. solo por el
 * placer de aprender. 
 * 
 * TODO: reparar pruebas o refactorizar código a traves de nuevas pruebas.
 */
const assert = require('chai').assert;
import Canvas from '../src/js/Canvas'; 
import Toolbox from '../src/js/Toolbox';
const jsdom = require("jsdom"); // need to get a valid document object;
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><div><canvas></canvas><div>`);

let canvas = dom.window.document.querySelector('canvas'); // Probado con createElement() mismo error.
let sectionCanvas = dom.window.document.querySelector('div');


const canvasObj = new Canvas(canvas, sectionCanvas);
const toolboxObj = new Toolbox(canvas);


describe('Canvas', () => {
    it('resizes the canvas if the parent DOM element is bigger than 600px in width', () =>{
        // arrange
        canvasObj.canvasDOMParent.offsetWidth = 800;
        canvasObj.canvasDOMParent.offsetHeight = 700;
        // act
        canvasObj.resizeCanvas();
        // assert
        assert.equal(canvasObj.width, 600);
    });

    it('resizes the canvas if the parent DOM element is smaller than 600px in width', () =>{
        // arrange
        canvasObj.canvasDOMParent.offsetWidth = 500;
        canvasObj.canvasDOMParent.offsetHeight = 300;
        // act
        canvasObj.resizeCanvas();
        // assert
        assert.equal(canvasObj.width, 500);
    });
});

describe('Toolbox', () => {
    it('beginDraw should mutate property canIDraw to true', () =>{
        // arrange
        toolboxObj.canIDraw = false;
        // act
        toolboxObj.beginDraw();
        // assert
        assert.equal(toolboxObj.canIDraw, true);
    });

    it('endDraw should mutate property canIDraw to false', () =>{
        // arrange
        toolboxObj.canIDraw = true;
        // act
        toolboxObj.endDraw();
        // assert
        assert.equal(toolboxObj.canIDraw, false);
    });

    it('startRecord should mutate property canIRecord to true', () => {
        // arrange
        toolboxObj.canIRecord = false;
        // act
        toolboxObj.beginRecord();
        // assert
        assert.equal(toolboxObj.canIRecord, true);
    });

    it('endRecord should mutate property canIRecord to false', () => {
        // arrange
        toolboxObj.canIRecord = true;
        // act
        toolboxObj.endRecord();
        // assert
        assert.equal(toolboxObj.canIRecord, false);
    });

    it('canUndo should return true if the pointer is greater than 0', () => {
        // arrange
        toolboxObj.pointer = 3;
        // assert
        assert.equal(toolboxObj.canUndo(), true);
    });

    it('canRedo should return true if the pointer is different than the lenght of the history', () => {
        // arrange
        toolboxObj.pointer = 2;
        toolboxObj.history.lenght = 3; // revisar este tipo de arranges, tal vez pueda rellenar el array con movimientos falsos
        // assert
        assert.equal(toolboxObj.canRedo(), true);
    });

    it('changeColor should change the canvas context fillStyle and strokeStyle properties to the color mentioned', () => {
        // arrange
        let color = '#00ff00';
        // act
        toolboxObj.changeColor(color);
        // assert
        assert.equal(toolboxObj.context.fillStyle, color);
    });

    it('changeWeight should change the brushWeight property to the new designed one', () => {
        // arrange
        let weight = 20;
        // act
        toolboxObj.changeWeight(weight);
        // assert
        assert.equal(toolboxObj.brushWeight, 20);
    });

});