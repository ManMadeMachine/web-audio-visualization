import geometry from './../utils/geometry';

class CanvasController {
    constructor(canvas){
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        const AudioContext = window.AudioContext || window.webkitAudioContext;

        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyserBufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.analyserBufferLength);

        this.draw = this.draw.bind(this);

        this.isLoaded = false;
        this.bgFlashing = false;    // Controls background flashing, based on the amplitude of the sound signal
        this.cube = false;  // Controls whether a pulsating cube is drawn in the middle of the canvas.

    }

    // TODO: Add a control for this feature, it should not be enabled automatically if I want to keep the
    // sample file playback option.
    listenToSpeakerOutput(){
        navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
            this.speakerSource = this.audioCtx.createMediaStreamSource(stream);
            this.speakerSource.connect(this.analyser);
            this.draw();
        }).catch(err => console.error(err));
    }

    // TODO: Do I want to load files from somewhere...?
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

    setBgFlashing(flashing){
        this.bgFlashing = flashing;
    }

    setCube(cube){
        this.cube = cube;
    }

    draw(){
        requestAnimationFrame(this.draw);
        this.analyser.getByteTimeDomainData(this.dataArray);

        const lowest = Math.min(...this.dataArray);
        const highest= Math.max(...this.dataArray);
        const amplitude = highest - lowest;

        if(this.bgFlashing){
            this.ctx.fillStyle = `rgb(${amplitude * Math.random()}, ${amplitude * Math.random()}, ${amplitude * Math.random()})`; // This option causes rapid FLASHING
        }else{
            this.ctx.fillStyle = 'rgb(10, 120, 150)'; //this just re-draws the background with a simple color, this DOES NOT FLASH
        }
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.cube){
            geometry.createRectangle(this.ctx, (this.width / 2) - (amplitude), (this.height / 2) - (amplitude),  amplitude * 2, amplitude * 2);
        }
    
        this.ctx.beginPath();
        
        const sliceWidth = this.width * 1.0 / this.analyserBufferLength;
        let x = 0;

        for (let i = 0; i < this.analyserBufferLength; i++){
            const v = this.dataArray[i] / 128.0;
            const y = (v *  this.height / 4) + this.height / 4; // The addition is a modifier so that the whole canvas height isn't used

            
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = `rgb(255, 255, 25)`;
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