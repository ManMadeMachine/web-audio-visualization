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

        this.bgFlashing = false;    // Controls background flashing, based on the amplitude of the sound signal.
        this.cube = false;  // Controls whether a pulsating cube is drawn in the middle of the canvas.
        this.waveform = false;  // Controls the waveform pattern to be rendered.
    }

    listenToSpeakerOutput(){
        console.log("listenToSpeakerOutput")
        navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
            this.audioCtx.resume();
            this.speakerSource = this.audioCtx.createMediaStreamSource(stream);
            this.speakerSource.connect(this.analyser);
            this.draw();
        }).catch(err => console.error("Error when starting audio context: " + err));
    }

    setBgFlashing(flashing){
        this.bgFlashing = flashing;
    }

    setCube(cube){
        this.cube = cube;
    }

    setWaveform(waveform){
        this.waveform = waveform;
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
            this.ctx.fillStyle = 'rgb(0, 0, 0)'; //this just re-draws the background with a simple color, this DOES NOT FLASH
        }
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.cube){
            geometry.createRectangle(this.ctx, (this.width / 2) - (amplitude), (this.height / 2) - (amplitude),  amplitude * 2, amplitude * 2); 
        }
        
        if (this.waveform){
            this.drawWaveform();
        }
        geometry.createCircle(this.ctx, this.width / 4, this.height / 4, amplitude / 2 );

    }

    drawWaveform(){
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