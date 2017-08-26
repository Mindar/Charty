import IDataProvider from './IDataProvider';
import IPointChartRenderer from './IPointChartRenderer';

import PointChartCanvasRenderer from './PointChartCanvasRenderer';
import CsvDataProvider from './CsvDataProvider';

export default class PointchartElement extends HTMLElement{
    private dataprovider : IDataProvider;
    private renderer : IPointChartRenderer;

    // maybe: HTMLHeadingElement title
    // maybe: HTMLElement description

    // Properties: xy Autoscale; xy Range; xy Datacolumn; Datasource, maybe Datatype

    constructor(){
        super();

        // Attach a shadow root to this element
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback(){
        // Add some default styling to the Charty element through it's shadow root.
        // This default styling is required to make charts appear as blocks 
        // instead of the custom element default (whatever that even is)
        const shadow = <ShadowRoot>this.shadowRoot;
        const defaultstyle = <HTMLStyleElement>document.createElement('style');
        defaultstyle.innerText = ':host {display:block; background-color: #f9f9f9;}';
        shadow.appendChild(defaultstyle);

        // Create a renderer
        this.renderer = new PointChartCanvasRenderer(this);

        // create dummy data
        var points : Array<any> = [];

        // Read known attributes
        // Read src
        if(this.hasAttribute('src')){
            const source = <string>this.getAttribute('src');
            this.dataprovider = new CsvDataProvider();
            const rawData : any = await this.dataprovider.load(source);

            if(rawData.axis.length >= 2){
                points = [];
                for(let i = 0; i < rawData.axis[0].data.length; i++){
                    let xVal = rawData.axis[0].data[i];
                    let yVal = rawData.axis[1].data[i];
                    points.push({x: xVal, y: yVal});
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
    }
}