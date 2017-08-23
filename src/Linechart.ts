export default class Linechart extends HTMLElement {
    private heading : HTMLHeadingElement;
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;


    constructor(){
        super();
        
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        // create shadow dom kids
        // get attributes etc
        // load data using the correct backend

        this.heading = document.createElement('h1');
        this.heading.innerText = '';

        this.canvas = document.createElement("canvas");
        this.canvas.height = 400;
        this.canvas.width = 400;
        this.ctx = <CanvasRenderingContext2D> this.canvas.getContext("2d");

        this.heading.innerText = <string>this.textContent;
        this.ctx.fillRect(0, 0, 200, 200);

        let observer = new MutationObserver(this.mutationHandler.bind(this));
        observer.observe(this, {childList: true});
        
        const shadow : ShadowRoot = <ShadowRoot>this.shadowRoot;
        shadow.appendChild(this.heading);
        shadow.appendChild(this.canvas);

        if(this.hasAttribute('src')){
            let csvsrc = <string> this.getAttribute('src');
            this.loadcsv(csvsrc);

        } else {
            console.log('No attrib found'); 
        }
    }

    mutationHandler(mutations : Array<MutationRecord>, observer : MutationObserver){
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if(node.nodeName == '#text'){
                    this.heading.textContent = node.textContent;
                }
            });
        });
    }

    loadcsv(src : string){
        var xhttp = new XMLHttpRequest();
        var self = this;

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                self.render(this.responseText);
            }
        };
        xhttp.open("GET", src, true);
        xhttp.send();
    }



    render(data : string){
        let lines = data.split('\n');
        lines.shift();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        // Canv border
        this.ctx.moveTo(1, 1);
        this.ctx.lineTo(this.canvas.width - 1, 1);
        this.ctx.lineTo(this.canvas.width - 1, this.canvas.height - 1);
        this.ctx.lineTo(1, this.canvas.height - 1);

        // Diagram
        this.ctx.moveTo(0, this.canvas.height);
        this.ctx.lineTo(1, 1);
        for(let i = 0; i < lines.length; i++){
            let x = Number.parseFloat(lines[i].split(';')[0]);
            let y = Number.parseFloat(lines[i].split(';')[1]);
            
            this.ctx.lineTo(x * 4, this.canvas.height - y);
        }
        this.ctx.stroke();
    }
}