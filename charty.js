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
Object.defineProperty(exports, "__esModule", { value: true });
class LinLinCoordinateSystem {
    set axiscol(color) {
        this.axisColor = color;
    }
    get axiscol() {
        return this.axisColor;
    }
    constructor(context) {
        this.ctx = context;
        this.axiscol = "#000";
        this.rescale();
    }
    draw() {
        // Calculate where each axis would be if it was drawn at the Zero-Value of the other axis
        let xAxisYPos = Math.round(this.getY({ y: 0 })) + 0.5;
        let yAxisXPos = Math.round(this.getX({ x: 0 })) + 0.5;
        const ctx = this.ctx;
        ctx.strokeStyle = this.axisColor;
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
        this.drawScale();
    }
    drawScale() {
        const yLevel = this.getY({ y: 0 });
        const xLevel = this.getX({ x: 0 });
        const c = this.ctx;
        //c.strokeStyle = this.axisColor;
        c.beginPath();
        // Draw all the x divisions in the correct place
        for (let i = 0; i < this.scaleXDivs; i++) {
            let tmp = this.scaleXMin + i * this.scaleXUnit;
            let x = Math.round(this.getX({ x: tmp })) + 0.5;
            c.moveTo(x, yLevel + 5);
            c.lineTo(x, yLevel - 5);
        }
        // Draw all the y divisions in the correct place
        for (let i = 0; i < this.scaleYDivs; i++) {
            let tmp = this.scaleYMin + i * this.scaleYUnit;
            let y = Math.round(this.getY({ y: tmp })) + 0.5;
            c.moveTo(xLevel + 5, y);
            c.lineTo(xLevel - 5, y);
        }
        c.stroke();
    }
    calculateScale() {
        // Utility consts that'll save some writing time
        const minX = this.xMin;
        const maxX = this.xMax;
        const rangeX = maxX - minX;
        const magX = Math.floor(Math.log10(rangeX)); // The order of magnitude of the x-range
        const minY = this.xMin;
        const maxY = this.xMax;
        const rangeY = maxY - minY;
        const magY = Math.floor(Math.log10(rangeY));
        // Ok, let me explain what's going on here:
        // We want to map the minimum from it's current range to the range from
        // -10 to 10. Let's say for example: it's 1.234 * 10^100, so a huge 
        // number. We don't want scale marks at weird places such as 1.234567,
        // we want the marks to be at "nice" numbers like 10, 200, 0.09, etc.
        // To do this we map the minX to the range [-10; 10] then find the floor
        // In our example this would map 1.234e100 to 1.234, if we get the 
        // floor of this number we get 1. 1 is smaller than the minimum, 
        // so we have our left most value. The next step is to do the same with
        // the maximum, but instead of flooring it, we get the ceiling of it.
        // Now we have 2 integers between -10 and 10. It's easy to draw a scale
        // for this very specific order of magnitude.
        // We get the min in the [-10;10] range by multiplying it with 10 times 
        // the range's negated order of magnitude;
        const minXNormalized = minX * Math.pow(10, -magX);
        console.log('minxnorm: ' + minXNormalized);
        // We then have to get the floor of this number
        const minXFloorNormalized = Math.floor(10 * minXNormalized);
        console.log('minxnormfloor: ' + minXFloorNormalized);
        // finally we raise it to the magX'th power to denormalize it (= put it
        // back into its original range)
        this.scaleXMin = Math.pow(Math.round(minXFloorNormalized), magX);
        console.log('this.scaleXmin: ' + this.scaleXMin);
        const maxXNormalized = maxX * Math.pow(10, -magX);
        console.log('maxxnorm: ' + maxXNormalized);
        const maxXCeilNormalized = Math.ceil(10 * maxXNormalized);
        console.log('maxxnormceil: ' + maxXCeilNormalized);
        this.scaleXMax = Math.pow(Math.round(maxXCeilNormalized), magX);
        console.log('this.sxmax: ' + this.scaleXMax);
        const minYNormalized = minY * Math.pow(10, -magY);
        const minYFloorNormalized = Math.ceil(10 * minYNormalized);
        this.scaleYMin = Math.pow(Math.round(minYFloorNormalized), magY);
        const maxYNormalized = maxY * Math.pow(10, -magY);
        const maxYCeilNormalized = Math.ceil(10 * maxYNormalized);
        this.scaleYMax = Math.pow(Math.round(maxYCeilNormalized), magY);
        // We also calculate the scale division size and number of 
        //(potentially) visible divisions, since it might be helpful at some
        // point.
        this.scaleXUnit = Math.pow(1, magX);
        console.log('scaleXunit: ' + this.scaleXUnit);
        this.scaleXDivs = maxXCeilNormalized - minXFloorNormalized;
        console.log('scaleXDivs: ' + this.scaleXDivs);
        this.scaleYUnit = Math.pow(1, magY);
        this.scaleYDivs = maxYCeilNormalized - minYFloorNormalized;
        console.log('scaleXMin: ' + this.scaleXMin);
        console.log('scaleXMax: ' + this.scaleXMax);
        console.log('scaleXDivs: ' + this.scaleXDivs);
        console.log('scaleXDivs: ' + this.scaleXDivs);
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
        this.calculateScale();
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

},{}],3:[function(require,module,exports){
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
        let axiscolor = window.getComputedStyle(this.host).getPropertyValue('--charty-axis-color').trim();
        this.coordSystem.axiscol = axiscolor;
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

},{"./LinLinCoordinateSystem":2}],4:[function(require,module,exports){
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
                        //console.log(xVal + ', ' + yVal);
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

},{"./CsvDataProvider":1,"./PointChartCanvasRenderer":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PointchartElement_1 = require("./PointchartElement");
// Import all other chart types
window.customElements.define('charty-pointchart', PointchartElement_1.default);
// Define all other chart types

},{"./PointchartElement":4}]},{},[5]);
