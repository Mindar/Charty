import CsvLoader from './CsvLoader';

export default class Linechart extends HTMLElement {
    private heading : HTMLHeadingElement;
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private chartdata : any;

    constructor(){
        super();
        
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback(){

        // read attributes
        if(this.hasAttribute('src')){
            let datasource = <string> this.getAttribute('src');
            await this.loadSource(datasource);
            // TODO: do some validation (correct number of axis (>2) etc)
        }

        // Check if we have a title text (aka textContent)
        if(this.textContent){
            const heading = document.createElement('h1');
            heading.textContent = this.textContent;
            const shadow = <ShadowRoot>this.shadowRoot;
            shadow.appendChild(heading);
            this.heading = heading;
        }

        // Create Shadow DOM Elements / Create Renderer
        this.createCanvas();

        // Create a Mutation Observer to check if a child was added
        let observer = new MutationObserver(this.mutationHandler.bind(this));
        observer.observe(this, {childList: true, characterData: true, subtree: true, attributes: true});

        console.log(observer);

        this.draw();
    }

    async loadSource(source : string){
        // For now we assume the source is a csv
        const loader : CsvLoader = new CsvLoader();
        this.chartdata = await loader.load(source);
    }

    draw(){
        // Clear the canvas so that we can draw a new chart
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the 2 axis
        this.drawAxis(this.chartdata.axis[0].name, true);
        this.drawAxis(this.chartdata.axis[1].name, false);

        // Draw the chart's data
        this.drawData(this.chartdata.axis[0].data, this.chartdata.axis[1].data);
    }

    drawData(xValues : Array<any>, yValues : Array<any>){
        // Find min and max of x and y
        //let xmin = Number.MAX_VALUE;
        //let xmax = Number.MIN_VALUE;
        console.log(yValues.length + ' and ' + xValues.length);

        this.ctx.fillStyle = '#44c';
        for(let i = 0; i < yValues.length; i++){
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

    drawAxis(axisname : string, isXAxis : boolean){
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

        if(isXAxis){
            // Draw a horizontal axis
            this.ctx.lineTo(xEnd, yStart);
            this.ctx.stroke();
            this.ctx.fillText(axisname, xEnd - 40, yStart - yEnd);
        } else {
            // Draw a vertical axis
            this.ctx.lineTo(xStart, yEnd);
            this.ctx.stroke();
            this.ctx.fillText(axisname, 2 * xStart, yEnd);
        }

    }

    createCanvas(){
        // Create a canvas and rendering context
        const canv = document.createElement('canvas');
        canv.height = 400;
        canv.width = 400;
        this.ctx = <CanvasRenderingContext2D> canv.getContext('2d');
        this.canvas = canv;

        // And append it to the shadow root
        const shadow = <ShadowRoot> this.shadowRoot;
        shadow.appendChild(canv);
    }

    mutationHandler(mutations : Array<MutationRecord>, observer : MutationObserver){
        console.log('A mutate!');
        // For now we only care about the #text node (the textContent) of the Element
        mutations.forEach((mutation) => {
            console.log(mutation);
            mutation.addedNodes.forEach((node) => {
                console.log(node);
                console.log(node.nodeName);
                // If the added node is a textnode...
                if(node.nodeName == '#text'){

                    // ...we want to add a heading with the #text's content
                    const shadow = <ShadowRoot> this.shadowRoot;
                    const heading = document.createElement('h1');
                    this.heading.textContent = node.textContent;

                    // We also want to add the heading to our shadow root
                    this.heading = heading;
                    shadow.appendChild(heading);
                }
            });
        });
    }

    



    render(data : string){
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
        for(let i = 0; i < lines.length; i++){
            let x = Number.parseFloat(lines[i].split(';')[0]);
            let y = Number.parseFloat(lines[i].split(';')[1]);
            
            this.ctx.lineTo(x * 4, this.canvas.height - y);
        }
        this.ctx.stroke();
    }
}