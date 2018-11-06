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

        this.isLoaded = false;

    }

    listenToSpeakerOutput(){
        navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
            this.speakerSource = this.audioCtx.createMediaStreamSource(stream);
            console.log("Got speaker audio source: " + this.speakerSource);
            this.speakerSource.connect(this.analyser);
            this.draw();
        }).catch(err => console.error(err));
    }

    load(fileName){
        console.log("Starting canvas controller...");
        this.fileName = fileName;

        // TODO: Load and prepare the file in it's own function. 
        // TODO: Check if there already was some sample playing, and flush the data buffer. Now the samples are mixed, since
        // a new buffer source is being created on sample load. 
        fetch(`/file/${fileName}`).then(response => {
            return response.arrayBuffer();
        }).then(arrayBuffer => {
            return this.audioCtx.decodeAudioData(arrayBuffer);
        }).then(sampleBuffer => {
            this.sampleSource = this.audioCtx.createBufferSource();
            this.sampleSource.buffer = sampleBuffer;
            this.sampleSource.connect(this.analyser).connect(this.audioCtx.destination); // TODO: connect this to audioCtx.destination when the play button is done
            
            //sampleSource.start(); // TODO: Bind this to a play button etc. to avoid annoyng instant playback on page load.
           
            console.log("SampleSource state: " + this.sampleSource);
            this.isLoaded = true;
            this.draw();

        });
        
    }

    play(){
        // This is the initial state, the sound sample has been created and loaded, and the context state is 'running'. 
        // In consecutive calls to this method, the state should be suspended.. *SHOULD* be..
        if (this.isLoaded && this.audioCtx.state === 'running'){
            this.sampleSource.start();
        }
        else if (this.audioCtx.state === 'suspended'){
            this.audioCtx.resume().then(() => {
                console.log("Playing sample");
            });
        }
    }

    pause(){
        if (this.audioCtx.state === 'running'){
           this.audioCtx.suspend().then(() => {
                console.log("Paused sample");
           })         
        }
    }

    draw(){
        requestAnimationFrame(this.draw);
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.ctx.fillStyle = 'rgb(10, 120, 150)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw the name of the file onto the canvas
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'rgb(30, 30, 30)'
        this.ctx.fillText(this.fileName, 20, 30);

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