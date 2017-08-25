export default interface ICoordinateSystem {
    draw() : void;
    rescale(data : any) : void;

    getX(point : any) : number;
    getY(point : any) : number;
}