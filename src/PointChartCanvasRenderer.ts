import ICoordinateSystem from './ICoordinateSystem';
import LinLinCoordinateSystem from './LinLinCoordinateSystem';

export default class PointChartCanvasRenderer {
    private host : HTMLElement;
    private shadow : ShadowRoot;
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private coordSystem : ICoordinateSystem;

    constructor(host : HTMLElement){
        // Init Shadow Root
        this.host = host;
        this.shadow = <ShadowRoot>host.shadowRoot;

        // Create Canvas element and add to shadow root
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.host.getBoundingClientRect().width;
        this.canvas.height = this.host.getBoundingClientRect().height;
        this.shadow.appendChild(this.canvas);

        // Create rendering context
        this.ctx = <CanvasRenderingContext2D> this.canvas.getContext('2d');

        this.coordSystem = new LinLinCoordinateSystem(this.ctx);
        this.draw();
    }

    draw(data : Array<any> | null = null){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw coordinate system
        this.coordSystem.draw();

        // if there is data, draw the data too
        if(data){
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