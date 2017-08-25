export default interface IDataProvider {
    load(source : string) : Promise<any>;
}