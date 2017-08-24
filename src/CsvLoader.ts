export default class CsvLoader{
    constructor(){

    }

    async load(source : string) : Promise<any>{
        const responseText = await this.loadData(source);

        // If the response is empty, we throw an error
        if(responseText == '') throw "Response was empty.";

        // At this point in the function we can be sure to have (at least an empty) a response.
        // We can therefore split the response text to get our lines
        let lines = responseText.split('\n');

        // Parse the lines into a data object:
        const response : any = this.parseLines(lines);

        return response;
    }

    parseLines(lines : string[]) : any{
        // Get first line/ header line
        let axisParts = lines[0].split(';');
        

        // Create the response object
        const response : any= {};
        response.dimensions = axisParts.length;
/*
        response: {}
            axis: [{}]
                name: string
                data: []
            dimensions: number
*/
        // Create the axis array
        response.axis = [];

        // Add each axis/dimension to the object
        axisParts.forEach((axis) => {
            // Create the new axis object and initialize it with a name and empty data array
            let newaxis : any = {};
            newaxis.name = axis;
            newaxis.data = [];

            // Add the axis to the response
            response.axis.push(newaxis);
        });

        // NOTE: at this point the response is valid (it might be empty though)

        // Fill each axis with data
        for(let i = 1; i < lines.length; i++){

            // Split the line at each semicolon
            let parts = lines[i].split(';');

            // Make sure the current line has the same number of elements as the header
            if(parts.length != axisParts.length) throw "Line " + i + " has an incorrect number of elements.";

            // For each part of the current line...
            for(let partIndex = 0; partIndex < parts.length; partIndex++){
                // TODO: maybe add some parsing logic here
                // The parsing logic should turn numbers into actual 'number'
                // objects (right now they are still strings)

                // TODO: think about how empty parts in csv lines should be handled
                // Right now the csv can contain lines such as '1;2;;;3;4'
                // Such a line would currently add 2 empty strings to 2 middle axis
                // Depending on the usecase this might not be particularly nice

                // ..we add an entry to the corresponding axis' data array
                response.axis[partIndex].data.push(parts[partIndex]);
            }
        }

        // All axis are filled with data, we can return the response
        return response;
    }

    async loadData(src : string) : Promise<string>{
        // Get the csv data from the server (asynchronously)
        // Since there might occur an error during the request,
        // we have to wrap it in a try catch.
        let responseText;
        try {
            responseText = await this.makerequest(src);
        } catch(e){
            console.log('An error occured:');
            console.log(e);
        }

        // If any error has occured, we return an empty string (no data was loaded)
        // TODO: Maybe add an onerror event to this class so that users can respond to errors accordingly
        if(responseText === undefined){
            return '';
        }

        return responseText;
    }

    async makerequest(src : string) : Promise<string>{
        // Create the Ajax request object
        var xhttp = new XMLHttpRequest();

        // Create our Promise and wrap the ajax request in this promise
        var ajaxPromise = new Promise<string>(function(resolve, reject){
            xhttp.onreadystatechange = function(){
                // Check if the request is done
                if(this.readyState == XMLHttpRequest.DONE){
                    if(this.status == 200){
                        // If the ajax request is done and the server has responded with code 200
                        // we should have gotten some response text
                        resolve(this.responseText);
                    } else {
                        // Otherwise there was an error and we reject the promise
                        reject('Invalid Server Response: ' + this.status);
                    }
                }
            };

            // If there is an error during the request we want to reject the promise
            xhttp.onerror = function(){
                reject('An error occured while doing a request.');
            };
        });

        // Open and send the request asynchronously using the GET method for the src URL
        xhttp.open('GET', src, true);
        xhttp.send();

        // Finally return the promise we just created
        return ajaxPromise;
    }
}