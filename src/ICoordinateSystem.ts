export default interface ICoordinateSystem {
    axiscol : string;
    draw() : void;
    rescale(data : any) : void;

    getX(point : any) : number;
    getY(point : any) : number;
}