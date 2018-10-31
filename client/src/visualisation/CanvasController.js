class CanvasController {
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }

    /**
     * TODO: For starters, fetch some sound file (from a cdn etc, so that it doesn't need to be on every dev machine). Then, 
     * create the frequency data array from the audio stream, and draw that to the canvas. The fetching should be initialised 
     * in here, and the actual drawing method should be called when the Promise is resolved.
     */
    start(){
        console.log("Starting canvas controller...");

        // Call this on Promise.resolve..
        this.draw();
        
    }

    /**
     * TODO: requestAnimationFrame, draw the audio frequency data and repeat as long as needed.
     */
    draw(){
        this.ctx.fillStyle = 'rgb(10, 120, 150)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height / 2);
        
        const segments = 64;
        const segLength = this.width / segments;
        
        for (let i = 0; i < segments; i++){
            const sine = Math.sin(Math.random() * Math.PI) * 100
            this.ctx.lineTo(i*segLength + segLength, (this.height / 2) - sine);
        }
        this.ctx.stroke();

    }
}

export default CanvasController;