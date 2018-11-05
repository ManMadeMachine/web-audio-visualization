class CanvasController {
    constructor(canvas){
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        const AudioContext = window.AudioContext || window.webkitAudioContext;

        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyserBufferLength = this.analyser.fftSize;
        this.dataArray = new Uint8Array(this.analyserBufferLength);

        this.draw = this.draw.bind(this);

    }

    start(){
        console.log("Starting canvas controller...");

        // TODO: Load and prepare the file in it's own function. 
        fetch('/file/dtmf.mp3').then(response => {
            return response.arrayBuffer();
        }).then(arrayBuffer => {
            return this.audioCtx.decodeAudioData(arrayBuffer);
        }).then(sampleBuffer => {
            const sampleSource = this.audioCtx.createBufferSource();
            sampleSource.buffer = sampleBuffer;
            sampleSource.connect(this.analyser); // TODO: connect this to audioCtx.destination when the play button is done
            
            sampleSource.start(); // TODO: Bind this to a play button etc. to avoid annoyng instant playback on page load.
            
            this.draw();

        });
        
    }

    draw(){
        requestAnimationFrame(this.draw);
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.ctx.fillStyle = 'rgb(10, 120, 150)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.beginPath();
        
        const sliceWidth = this.width * 1.0 / this.analyserBufferLength;
        let x = 0;

        for (let i = 0; i < this.analyserBufferLength; i++){
            const v = this.dataArray[i] / 128.0;
            const y = (v *  this.height / 4) + this.height / 4; // The addition is a modifier so that the whole canvas height isn't used

            if (i === 0){
                this.ctx.moveTo(x, y);
            }
            else{
                this.ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }
        this.ctx.stroke();

    }
}

export default CanvasController;