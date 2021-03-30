import geometry from './utils/geometry';
import { vertexShaderSource, fragmentShaderSource } from './shaders/2dShaders';

class CanvasController {
    constructor(canvas){
        // this.ctx = canvas.getContext('2d');  // CANNOT CREATE BOTH CONTEXTS!
        this.gl = canvas.getContext('webgl2');

        if (!this.gl){
            console.log("WebGL2 not available");
            return;
        }
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

    drawWebGL(){
        /* BEGIN INITIALIZATION CODE */
        if (!this.gl){
            console.log(`Could not retrieve WebGL context from canvas!`);
            return;
        }

        console.log(`WebGL context initialized!`);

        const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = this.createProgram(this.gl, vertexShader, fragmentShader);

        // Look up the location of the attribute 'a_position' in the just-created program
        const positionAttributeLocation = this.gl.getAttribLocation(program, 'a_position');

        // Look up the uniform location
        // const resolutionUniformLocation = this.gl.getUniformLocation(program, 'u_resolution');
        
        // const colorUniformLocation = this.gl.getUniformLocation(program, 'u_color');

        // Create a binary data buffer for position
        const positionBuffer = this.gl.createBuffer();

        // Create a binding between local buffer and WebGL bind point.
        // This way WebGL can use the local resource through the bind point.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        /* END INITIALIZATION CODE */
        
        /* BEGIN RENDERING CODE (this code should be called every time we actually want to draw something) */

        // Three 2D points
        const positions = [
            0, 0,
            0, 0.5,
            0.7, 0,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        const vao = this.gl.createVertexArray();

        this.gl.bindVertexArray(vao);

        this.gl.enableVertexAttribArray(positionAttributeLocation);

        // Resize the GL viewport to match the canvas size
        // this.gl.viewport(0, 0, this.width, this.height);

        // Clear the canvas
        // this.gl.clearColor(0, 0, 0, 0);
        // this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Tell WebGL to use our program (a pair of shaders)
        // this.gl.useProgram(program);

        
        // Enable the position attribute
        // this.gl.enableVertexAttribArray(positionAttribLocation);
        
        // The attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        const size = 2;                     // read 2 components per iteration (x,y coordinates)
        const type = this.gl.FLOAT;         // 32 bit float values
        const normalize = false;            // don't normalize the data
        const stride = 0;                   // 0 = move forward size * sizeof(type) in each iteration to get the next position.
        const offset = 0;                   // start at the beginning of the buffer
        
        this.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
        
        // this.gl.uniform2f(resolutionUniformLocation, this.width, this.height);
        
        
        // geometry.setRectangle(this.gl, 350, 200, 50, 400);
        // this.gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
        // const primitiveType = this.gl.TRIANGLES;
        // const offset = 0;
        // const count = 6;
        // this.gl.drawArrays(primitiveType, offset, count);
    }

    createShader(gl, type, source){
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(success){
            return shader;
        }
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    createProgram(gl, vertexShader, fragmentShader){
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(success){
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
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