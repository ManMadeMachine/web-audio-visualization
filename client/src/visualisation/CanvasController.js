class CanvasController {
    constructor(canvas){
        this.canvas = canvas;
    }

    /**
     * TODO: For starters, fetch some sound file (from a cdn etc, so that it doesn't need to be on every dev machine). Then, 
     * create the frequency data array from the audio stream, and draw that to the canvas. The fetching should be initialised 
     * in here, and the actual drawing method should be called when the Promise is resolved.
     */
    start(){
        console.log("Starting canvas controller...");
    }

    /**
     * TODO: requestAnimationFrame, draw the audio frequency data and repeat as long as needed.
     */
    draw(){

    }
}

export default CanvasController;