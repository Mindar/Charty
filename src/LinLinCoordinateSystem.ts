import ICoordinateSystem from './ICoordinateSystem'

export default class LinLinCoordinateSystem implements ICoordinateSystem{
    private xMin : number;
    private xMax : number;
    private yMin : number;
    private yMax : number;
    private xDivisions : number;
    private yDivisions : number;

    private ctx : CanvasRenderingContext2D;

    constructor(context : CanvasRenderingContext2D){
        this.ctx = context;
        this.rescale();
    }

    draw(): void {
        // Calculate where each axis would be if it was drawn at the Zero-Value of the other axis
        let xAxisYPos = Math.round(this.getY({y: 0})) + 0.5;
        let yAxisXPos = Math.round(this.getX({x: 0})) + 0.5;

        const ctx = this.ctx;
        ctx.strokeStyle = '#000';

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

        // TODO: Calculate how many divisons there will be
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