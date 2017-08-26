import ICoordinateSystem from './ICoordinateSystem'

export default class LinLinCoordinateSystem implements ICoordinateSystem{
    private xMin : number;
    private xMax : number;
    private yMin : number;
    private yMax : number;
    
    private axisColor : string;

    private scaleXMin : number;
    private scaleXMax : number;
    private scaleXUnit : number;
    private scaleXDivs : number;

    private scaleYMin : number;
    private scaleYMax : number;
    private scaleYUnit : number;
    private scaleYDivs : number;

    public set axiscol(color : string){
        this.axisColor = color;
    }

    public get axiscol(){
        return this.axisColor;
    }

    private ctx : CanvasRenderingContext2D;

    constructor(context : CanvasRenderingContext2D){
        this.ctx = context;
        this.axiscol = "#000";
        this.rescale();
    }

    draw(): void {
        // Calculate where each axis would be if it was drawn at the Zero-Value of the other axis
        let xAxisYPos = Math.round(this.getY({y: 0})) + 0.5;
        let yAxisXPos = Math.round(this.getX({x: 0})) + 0.5;

        const ctx = this.ctx;

        ctx.strokeStyle = this.axisColor;

        // If the x axis would be drawn outside the canvas, we draw it at the bottom
        if((xAxisYPos < ctx.canvas.height) && (xAxisYPos > 0)) {
            // Draw it in the canvas
            ctx.moveTo(0, xAxisYPos);
            ctx.lineTo(ctx.canvas.width, xAxisYPos);
        } else {
            // Draw it on the bottom
            let ypos = Math.round(ctx.canvas.height - 1) + 0.5;
            ctx.moveTo(0, ypos);
            ctx.lineTo(ctx.canvas.width, ypos);
        }

        // If the y axis would be drawn outside the canvas, we draw it at the left
        if((yAxisXPos < ctx.canvas.width) && (yAxisXPos > 0)) {
            // Draw it in the canvas
            ctx.moveTo(yAxisXPos, ctx.canvas.height);
            ctx.lineTo(yAxisXPos, 0);
        } else {
            // Draw it on the left
            ctx.moveTo(0.5, ctx.canvas.height);
            ctx.lineTo(0.5, 0);
        }

        ctx.stroke();

        this.drawScale();
    }

    private drawScale(){
        const yLevel = this.getY({y: 0});
        const xLevel = this.getX({x: 0});
        const c = this.ctx;
        
        //c.strokeStyle = this.axisColor;
        c.beginPath();
        

        // Draw all the x divisions in the correct place
        for(let i = 0; i < this.scaleXDivs; i++){
            let tmp = this.scaleXMin + i * this.scaleXUnit;
            let x = Math.round(this.getX({x: tmp})) + 0.5;
            c.moveTo(x, yLevel + 5);
            c.lineTo(x, yLevel - 5);
        }

        // Draw all the y divisions in the correct place
        for(let i = 0; i < this.scaleYDivs; i++){
            let tmp = this.scaleYMin + i * this.scaleYUnit;
            let y = Math.round(this.getY({y: tmp})) + 0.5;
            c.moveTo(xLevel + 5, y);
            c.lineTo(xLevel - 5, y);
        }

        c.stroke();
    }

    private calculateScale(){
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

    rescale(data: Array<any> | null = null): void {
        if(data === null) {
            // Set min and max for x and y to defaults
            this.xMin = -5;
            this.xMax = 5;
            this.yMin = -5;
            this.yMax = 5;
        } else {
            // Find min and max for x and y
            this.xMin = Number.MAX_VALUE;
            this.xMax = Number.MIN_VALUE;
            this.yMin = Number.MAX_VALUE;
            this.yMax = Number.MIN_VALUE;

            data.forEach((point) => {
                if(point.x > this.xMin) this.xMin = point.x;
                if(point.x < this.xMin) this.xMin = point.x;
                if(point.y > this.yMin) this.yMin = point.y;
                if(point.y < this.yMin) this.yMin = point.y;
            });
        }
        this.calculateScale();
    }

    getX(point : any): number {
        let rangeValueSpace = this.xMax - this.xMin;
        let pixelsPerValue = this.ctx.canvas.width / rangeValueSpace;
        let result = point.x * pixelsPerValue;
        result -= this.xMin * pixelsPerValue; // Offset for xMin
        return result;
    }

    getY(point : any): number {
        let rangeValueSpace = this.yMax - this.yMin; // Calculate the range of y values inside the viewport
        let pixelsPerValue = this.ctx.canvas.height / rangeValueSpace; // Calculate how many pixels per 1 unit of y there are
        let result = point.y * pixelsPerValue;
        result -= this.yMin * pixelsPerValue; // Offset for yMin
        return this.ctx.canvas.height - result;
    }

}