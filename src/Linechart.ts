export default class Linechart extends HTMLElement {
    constructor(){
        super();
        console.log('Hi! I\'m a custom Linechart element!');

        this.load();
    }

    load(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
            }
        };
        xhttp.open("GET", "data.csv", true);
        xhttp.send();
    }
}