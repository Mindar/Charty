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
class CsvDataProvider {
    load(source) {
        return __awaiter(this, void 0, void 0, function* () {
            const responsetext = yield this.loadData(source);
            return this.parse(responsetext);
        });
    }
    parse(csvtext) {
        var response = {};
        // A valid csv must contain at least the header
        var lines = csvtext.split('\n');
        if (lines.length < 1) {
            return response;
        }
        // Get the header line
        var header = lines.shift();
        var colNames = header.split(';');
        // There must be at least 2 data columns
        if (colNames.length < 2) {
            return response;
        }
        // Create our axis array
        response.axis = [];
        // For each column named in the header, create a new axis
        colNames.forEach((col) => {
            let newcol = {};
            newcol.name = col;
            newcol.data = [];
            response.axis.push(newcol);
        });
        // For each line, split the line at ';', then add each value to the corresponding axis
        lines.forEach((line) => {
            const parts = line.split(';');
            for (let i = 0; i < response.axis.length; i++) {
                response.axis[i].data.push(parts[i]);
            }
        });
        return response;
    }
    loadData(src) {
        return __awaiter(this, void 0, void 0, function* () {
            let responseText;
            try {
                responseText = yield this.makerequest(src);
            }
            catch (e) {
                // Change this so the response object of .load has an "error" field
                responseText = '';
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
exports.default = CsvDataProvider;

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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LinLinCoordinateSystem {
    constructor(context) {
        this.ctx = context;
        this.rescale();
    }
    draw() {
        // Calculate where each axis would be if it was drawn at the Zero-Value of the other axis
        let xAxisYPos = Math.round(this.getY({ y: 0 })) + 0.5;
        let yAxisXPos = Math.round(this.getX({ x: 0 })) + 0.5;
        const ctx = this.ctx;
        ctx.strokeStyle = '#000';
        // If the x axis would be drawn outside the canvas, we draw it at the bottom
        if ((xAxisYPos < ctx.canvas.height) && (xAxisYPos > 0)) {
            // Draw it in the canvas
            ctx.moveTo(0, xAxisYPos);
            ctx.lineTo(ctx.canvas.width, xAxisYPos);
        }
        else {
            // Draw it on the bottom
            let ypos = Math.round(ctx.canvas.height - 1) + 0.5;
            ctx.moveTo(0, ypos);
            ctx.lineTo(ctx.canvas.width, ypos);
        }
        // If the y axis would be drawn outside the canvas, we draw it at the left
        if ((yAxisXPos < ctx.canvas.width) && (yAxisXPos > 0)) {
            // Draw it in the canvas
            ctx.moveTo(yAxisXPos, ctx.canvas.height);
            ctx.lineTo(yAxisXPos, 0);
        }
        else {
            // Draw it on the left
            ctx.moveTo(0.5, ctx.canvas.height);
            ctx.lineTo(0.5, 0);
        }
        ctx.stroke();
    }
    rescale(data = null) {
        if (data === null) {
            // Set min and max for x and y to defaults
            this.xMin = -5;
            this.xMax = 5;
            this.yMin = -5;
            this.yMax = 5;
        }
        else {
            // Find min and max for x and y
            this.xMin = Number.MAX_VALUE;
            this.xMax = Number.MIN_VALUE;
            this.yMin = Number.MAX_VALUE;
            this.yMax = Number.MIN_VALUE;
            data.forEach((point) => {
                if (point.x > this.xMin)
                    this.xMin = point.x;
                if (point.x < this.xMin)
                    this.xMin = point.x;
                if (point.y > this.yMin)
                    this.yMin = point.y;
                if (point.y < this.yMin)
                    this.yMin = point.y;
            });
        }
        // TODO: Calculate how many divisons there will be
    }
    getX(point) {
        let rangeValueSpace = this.xMax - this.xMin;
        let pixelsPerValue = this.ctx.canvas.width / rangeValueSpace;
        let result = point.x * pixelsPerValue;
        result -= this.xMin * pixelsPerValue; // Offset for xMin
        return result;
    }
    getY(point) {
        let rangeValueSpace = this.yMax - this.yMin; // Calculate the range of y values inside the viewport
        let pixelsPerValue = this.ctx.canvas.height / rangeValueSpace; // Calculate how many pixels per 1 unit of y there are
        let result = point.y * pixelsPerValue;
        result -= this.yMin * pixelsPerValue; // Offset for yMin
        return this.ctx.canvas.height - result;
    }
}
exports.default = LinLinCoordinateSystem;

},{}],4:[function(require,module,exports){
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

},{"./CsvLoader":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LinLinCoordinateSystem_1 = require("./LinLinCoordinateSystem");
class PointChartCanvasRenderer {
    constructor(host) {
        // Init Shadow Root
        this.host = host;
        this.shadow = host.shadowRoot;
        // Create Canvas element and add to shadow root
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.host.getBoundingClientRect().width;
        this.canvas.height = this.host.getBoundingClientRect().height;
        this.shadow.appendChild(this.canvas);
        // Create rendering context
        this.ctx = this.canvas.getContext('2d');
        this.coordSystem = new LinLinCoordinateSystem_1.default(this.ctx);
        this.draw();
    }
    draw(data = null) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw coordinate system
        this.coordSystem.draw();
        // if there is data, draw the data too
        if (data) {
            // draw all data
            this.ctx.fillStyle = '#f44';
            data.forEach((point) => {
                let x = this.coordSystem.getX(point);
                let y = this.coordSystem.getY(point);
                this.ctx.fillRect(x - 2, y - 2, 4, 4);
            });
        }
    }
}
exports.default = PointChartCanvasRenderer;

},{"./LinLinCoordinateSystem":3}],6:[function(require,module,exports){
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
const PointChartCanvasRenderer_1 = require("./PointChartCanvasRenderer");
const CsvDataProvider_1 = require("./CsvDataProvider");
class PointchartElement extends HTMLElement {
    // maybe: HTMLHeadingElement title
    // maybe: HTMLElement description
    // Properties: xy Autoscale; xy Range; xy Datacolumn; Datasource, maybe Datatype
    constructor() {
        super();
        // Attach a shadow root to this element
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        return __awaiter(this, void 0, void 0, function* () {
            // Add some default styling to the Charty element through it's shadow root.
            // This default styling is required to make charts appear as blocks 
            // instead of the custom element default (whatever that even is)
            const shadow = this.shadowRoot;
            const defaultstyle = document.createElement('style');
            defaultstyle.innerText = ':host {display:block; background-color: #f9f9f9;}';
            shadow.appendChild(defaultstyle);
            // Create a renderer
            this.renderer = new PointChartCanvasRenderer_1.default(this);
            // create dummy data
            var points = [];
            // Read known attributes
            // Read src
            if (this.hasAttribute('src')) {
                const source = this.getAttribute('src');
                this.dataprovider = new CsvDataProvider_1.default();
                const rawData = yield this.dataprovider.load(source);
                if (rawData.axis.length >= 2) {
                    points = [];
                    for (let i = 0; i < rawData.axis[0].data.length; i++) {
                        let xVal = rawData.axis[0].data[i];
                        let yVal = rawData.axis[1].data[i];
                        points.push({ x: xVal, y: yVal });
                        console.log(xVal + ', ' + yVal);
                    }
                }
                this.renderer.draw(points);
                //get IDataProvider for this source type
                // NOTE: Default IDataProvider is a CsvDataProvider
            }
            // Read renderer options (xy scaling, autoscale, ...)
            // Create right type of IDataProvider 
            // Create right type of IPointChartRenderer
            // Set callback for IDataProvider.newDataCallback
            // Call method that updates the chart according to all attributes and children
        });
    }
}
exports.default = PointchartElement;

},{"./CsvDataProvider":1,"./PointChartCanvasRenderer":5}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Linechart_1 = require("./Linechart");
const PointchartElement_1 = require("./PointchartElement");
// Import all other chart types
window.customElements.define('charty-linechart', Linechart_1.default);
window.customElements.define('charty-pointchart', PointchartElement_1.default);
// Define all other chart types

},{"./Linechart":4,"./PointchartElement":6}]},{},[7]);
