(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class CsvLoader {
    constructor() {
    }
    load(source) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseText = yield this.loadData(source);
            // If the response is empty, we throw an error
            if (responseText == '')
                throw "Response was empty.";
            // At this point in the function we can be sure to have (at least an empty) a response.
            // We can therefore split the response text to get our lines
            let lines = responseText.split('\n');
            // Parse the lines into a data object:
            const response = this.parseLines(lines);
            return response;
        });
    }
    parseLines(lines) {
        // Get first line/ header line
        let axisParts = lines[0].split(';');
        // Create the response object
        const response = {};
        response.dimensions = axisParts.length;
        /*
                response: {}
                    axis: [{}]
                        name: string
                        data: []
                    dimensions: number
        */
        // Create the axis array
        response.axis = [];
        // Add each axis/dimension to the object
        axisParts.forEach((axis) => {
            // Create the new axis object and initialize it with a name and empty data array
            let newaxis = {};
            newaxis.name = axis;
            newaxis.data = [];
            // Add the axis to the response
            response.axis.push(newaxis);
        });
        // NOTE: at this point the response is valid (it might be empty though)
        // Fill each axis with data
        for (let i = 1; i < lines.length; i++) {
            // Split the line at each semicolon
            let parts = lines[i].split(';');
            // Make sure the current line has the same number of elements as the header
            if (parts.length != axisParts.length)
                throw "Line " + i + " has an incorrect number of elements.";
            // For each part of the current line...
            for (let partIndex = 0; partIndex < parts.length; partIndex++) {
                // TODO: maybe add some parsing logic here
                // The parsing logic should turn numbers into actual 'number'
                // objects (right now they are still strings)
                // TODO: think about how empty parts in csv lines should be handled
                // Right now the csv can contain lines such as '1;2;;;3;4'
                // Such a line would currently add 2 empty strings to 2 middle axis
                // Depending on the usecase this might not be particularly nice
                // ..we add an entry to the corresponding axis' data array
                response.axis[partIndex].data.push(parts[partIndex]);
            }
        }
        // All axis are filled with data, we can return the response
        return response;
    }
    loadData(src) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the csv data from the server (asynchronously)
            // Since there might occur an error during the request,
            // we have to wrap it in a try catch.
            let responseText;
            try {
                responseText = yield this.makerequest(src);
            }
            catch (e) {
                console.log('An error occured:');
                console.log(e);
            }
            // If any error has occured, we return an empty string (no data was loaded)
            // TODO: Maybe add an onerror event to this class so that users can respond to errors accordingly
            if (responseText === undefined) {
                return '';
            }
            return responseText;
        });
    }
    makerequest(src) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the Ajax request object
            var xhttp = new XMLHttpRequest();
            // Create our Promise and wrap the ajax request in this promise
            var ajaxPromise = new Promise(function (resolve, reject) {
                xhttp.onreadystatechange = function () {
                    // Check if the request is done
                    if (this.readyState == XMLHttpRequest.DONE) {
                        if (this.status == 200) {
                            // If the ajax request is done and the server has responded with code 200
                            // we should have gotten some response text
                            resolve(this.responseText);
                        }
                        else {
                            // Otherwise there was an error and we reject the promise
                            reject('Invalid Server Response: ' + this.status);
                        }
                    }
                };
                // If there is an error during the request we want to reject the promise
                xhttp.onerror = function () {
                    reject('An error occured while doing a request.');
                };
            });
            // Open and send the request asynchronously using the GET method for the src URL
            xhttp.open('GET', src, true);
            xhttp.send();
            // Finally return the promise we just created
            return ajaxPromise;
        });
    }
}
exports.default = CsvLoader;

},{}],2:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CsvLoader_1 = require("./CsvLoader");
class Linechart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        return __awaiter(this, void 0, void 0, function* () {
            // read attributes
            if (this.hasAttribute('src')) {
                let datasource = this.getAttribute('src');
                yield this.loadSource(datasource);
                // TODO: do some validation (correct number of axis (>2) etc)
            }
            // Check if we have a title text (aka textContent)
            if (this.textContent) {
                const heading = document.createElement('h1');
                heading.textContent = this.textContent;
                const shadow = this.shadowRoot;
                shadow.appendChild(heading);
                this.heading = heading;
            }
            // Create Shadow DOM Elements / Create Renderer
            this.createCanvas();
            // Create a Mutation Observer to check if a child was added
            let observer = new MutationObserver(this.mutationHandler.bind(this));
            observer.observe(this, { childList: true, characterData: true, subtree: true, attributes: true });
            console.log(observer);
            this.draw();
        });
    }
    loadSource(source) {
        return __awaiter(this, void 0, void 0, function* () {
            // For now we assume the source is a csv
            const loader = new CsvLoader_1.default();
            this.chartdata = yield loader.load(source);
        });
    }
    draw() {
        // Clear the canvas so that we can draw a new chart
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw the 2 axis
        this.drawAxis(this.chartdata.axis[0].name, true);
        this.drawAxis(this.chartdata.axis[1].name, false);
        // Draw the chart's data
        this.drawData(this.chartdata.axis[0].data, this.chartdata.axis[1].data);
    }
    drawData(xValues, yValues) {
        // Find min and max of x and y
        //let xmin = Number.MAX_VALUE;
        //let xmax = Number.MIN_VALUE;
        console.log(yValues.length + ' and ' + xValues.length);
        this.ctx.fillStyle = '#44c';
        for (let i = 0; i < yValues.length; i++) {
            let x = Number.parseFloat(xValues[i]);
            x *= 3; // TODO: REMOVE THIS! This is only a temporary scaling factor for testing and *will* break production
            x += Math.round(this.canvas.width * 0.05);
            let y = -Number.parseFloat(yValues[i]);
            y += Math.round(this.canvas.height - this.canvas.height * 0.05);
            this.ctx.fillRect(x, y, 5, 5);
            console.log('raw: ' + xValues[i] + ', ' + yValues[i]);
            console.log('drawen: ' + x + ', ' + y);
        }
    }
    drawAxis(axisname, isXAxis) {
        // The x and y values can be used for both axis
        // x value is different from start to end
        let xStart = Math.round(this.canvas.width * 0.05) + 0.5;
        let xEnd = Math.round(this.canvas.width - xStart) + 0.5;
        // Y value is constant (This axis' direction is towards the negative,
        // as opposed to the x-Axis which goes from negative to positive)
        let yEnd = Math.round(this.canvas.height * 0.05) + 0.5;
        let yStart = Math.round(this.canvas.height - yEnd) + 0.5;
        this.ctx.strokeStyle = '#000';
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.moveTo(xStart, yStart);
        if (isXAxis) {
            // Draw a horizontal axis
            this.ctx.lineTo(xEnd, yStart);
            this.ctx.stroke();
            this.ctx.fillText(axisname, xEnd - 40, yStart - yEnd);
        }
        else {
            // Draw a vertical axis
            this.ctx.lineTo(xStart, yEnd);
            this.ctx.stroke();
            this.ctx.fillText(axisname, 2 * xStart, yEnd);
        }
    }
    createCanvas() {
        // Create a canvas and rendering context
        const canv = document.createElement('canvas');
        canv.height = 400;
        canv.width = 400;
        this.ctx = canv.getContext('2d');
        this.canvas = canv;
        // And append it to the shadow root
        const shadow = this.shadowRoot;
        shadow.appendChild(canv);
    }
    mutationHandler(mutations, observer) {
        console.log('A mutate!');
        // For now we only care about the #text node (the textContent) of the Element
        mutations.forEach((mutation) => {
            console.log(mutation);
            mutation.addedNodes.forEach((node) => {
                console.log(node);
                console.log(node.nodeName);
                // If the added node is a textnode...
                if (node.nodeName == '#text') {
                    // ...we want to add a heading with the #text's content
                    const shadow = this.shadowRoot;
                    const heading = document.createElement('h1');
                    this.heading.textContent = node.textContent;
                    // We also want to add the heading to our shadow root
                    this.heading = heading;
                    shadow.appendChild(heading);
                }
            });
        });
    }
    render(data) {
        let lines = data.split('\n');
        lines.shift();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        // Canv border
        this.ctx.moveTo(1, 1);
        this.ctx.lineTo(this.canvas.width - 1, 1);
        this.ctx.lineTo(this.canvas.width - 1, this.canvas.height - 1);
        this.ctx.lineTo(1, this.canvas.height - 1);
        // Diagram
        this.ctx.moveTo(0, this.canvas.height);
        this.ctx.lineTo(1, 1);
        for (let i = 0; i < lines.length; i++) {
            let x = Number.parseFloat(lines[i].split(';')[0]);
            let y = Number.parseFloat(lines[i].split(';')[1]);
            this.ctx.lineTo(x * 4, this.canvas.height - y);
        }
        this.ctx.stroke();
    }
}
exports.default = Linechart;

},{"./CsvLoader":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Linechart_1 = require("./Linechart");
// Import all other chart types
window.customElements.define('charty-linechart', Linechart_1.default);
// Define all other chart types

},{"./Linechart":2}]},{},[3]);
