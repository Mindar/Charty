(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Linechart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        // create shadow dom kids
        // get attributes etc
        // load data using the correct backend
        this.heading = document.createElement('h1');
        this.heading.innerText = '';
        this.canvas = document.createElement("canvas");
        this.canvas.height = 400;
        this.canvas.width = 400;
        this.ctx = this.canvas.getContext("2d");
        this.heading.innerText = this.textContent;
        this.ctx.fillRect(0, 0, 200, 200);
        let observer = new MutationObserver(this.mutationHandler.bind(this));
        observer.observe(this, { childList: true });
        const shadow = this.shadowRoot;
        shadow.appendChild(this.heading);
        shadow.appendChild(this.canvas);
        if (this.hasAttribute('src')) {
            let csvsrc = this.getAttribute('src');
            this.loadcsv(csvsrc);
        }
        else {
            console.log('No attrib found');
        }
    }
    mutationHandler(mutations, observer) {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName == '#text') {
                    this.heading.textContent = node.textContent;
                }
            });
        });
    }
    loadcsv(src) {
        var xhttp = new XMLHttpRequest();
        var self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                self.render(this.responseText);
            }
        };
        xhttp.open("GET", src, true);
        xhttp.send();
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

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Linechart_1 = require("./Linechart");
// Import all other chart types
window.customElements.define('charty-linechart', Linechart_1.default);
// Define all other chart types

},{"./Linechart":1}]},{},[2]);
