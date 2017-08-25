import IDataProvider from './IDataProvider';

export default class CsvDataProvider implements IDataProvider {
    async load(source : string) : Promise<any>{
        const responsetext = await this.loadData(source);
        return this.parse(responsetext);
    }

    parse(csvtext : string) : any{
        var response : any = {};

        // A valid csv must contain at least the header
        var lines = csvtext.split('\n');
        if(lines.length < 1){
            return response;
        }

        // Get the header line
        var header = <string>lines.shift();
        var colNames = header.split(';');

        // There must be at least 2 data columns
        if(colNames.length < 2) {
            return response;
        }

        // Create our axis array
        response.axis = [];

        // For each column named in the header, create a new axis
        colNames.forEach((col) => {
            let newcol : any = {};
            newcol.name = col;
            newcol.data = [];
            response.axis.push(newcol);
        });

        // For each line, split the line at ';', then add each value to the corresponding axis
        lines.forEach((line) => {
            const parts = line.split(';');
            for(let i = 0; i < response.axis.length; i++){
                response.axis[i].data.push(parts[i]);
            }
        });
        
        return response;
    }

    async loadData(src : string){
        let responseText : string;
        try{
            responseText = await this.makerequest(src);
        } catch(e){
            // Change this so the response object of .load has an "error" field
            responseText = '';
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