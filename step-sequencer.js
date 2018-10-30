
const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioCtx = new AudioContext();

const pads = document.querySelectorAll('.pads');
const allPadButtons = document.querySelectorAll('#tracks button');

// switch aria attribute on click
allPadButtons.forEach(el => {
    el.addEventListener('click', () => {
        if(el.getAttribute('aria-checker') === 'false'){
            el.setAttribute('aria-checked', 'true');
        }
        else{
            el.setAttribute('aria-checked', 'false');
        }
    }, false);
})

let wave = audioCtx.createPeriodicWave(wavetable.real, wavetable.imag);

let attackTime = 0.2;
const attackControl = document.querySelector('#attack');
attackControl.addEventListener('input', function(){
    attackTime = Number(this.value);
}, false);

let releaseTime = 0.5;
const releaseControl = document.querySelector('#release');
releaseControl.addEventListener('input', function(){
    releaseTime = Number(this.value);
}, false);

let sweepLength = 2;
function playSweep(){
    let osc = audioCtx.createOscillator();
    osc.setPeriodicWave(wave);
    osc.frequency.value = 440;

    let sweepEnv = audioCtx.createGain();
    sweepEnv.gain.cancelScheduledValues(audioCtx.currentTime);
    sweepEnv.gain.setValueAtTime(0, audioCtx.currentTime);

    //set our attack
    sweepEnv.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attackTime);
    //.. and release
    sweepEnv.gain.linearRampToValueAtTime(0, audioCtx.currentTime + sweepLength - releaseTime);

    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1);
}

let pulseHz = 880;
const hzControl = document.querySelector('#hz');
hzControl.addEventListener('input', function(){
    pulseHz = Number(this.value);
}, false);

let lfoHz = 30;
const lfoControl = document.querySelector('#lfo');
lfoControl.addEventListener('input', function(){
    lfoHz = Number(this.value);
}, false);

let pulseTime = 1;
function playPulse(){
    let osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pulseHz, audioCtx.currentTime);

    let amp = audioCtx.createGain();
    amp.gain.setValueAtTime(1, audioCtx.currentTime);

    let lfo = audioCtx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(lfoHz, audioCtx.currentTime);

    lfo.connect(amp.gain);
    osc.connect(amp).connect(audioCtx.destination);
    lfo.start();
    osc.start();
    osc.stop(audioCtx.currentTime + pulseTime)
}

let noiseDuration = 1;
const durControl = document.querySelector('#duration');
durControl.addEventListener('input', function(){
    noiseDuration = Number(this.value);
}, false);

let bandHz = 1000;
const bandControl = document.querySelector('#band');
bandControl.addEventListener('input', function(){
    bandHz = Number(this.value);
}, false);

function playNoise(){
    const bufferSize = audioCtx.sampleRate * noiseDuration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    let data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++){
        data[i] = Math.random() * 2 - 1;
    }

    let bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = bandHz;

    let noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    noise.connect(bandpass).connect(audioCtx.destination);
    noise.start();
}

async function getFile(audioContext, filePath){
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

async function setupSample(){
    const filePath = 'dtmf.mp3';
    const sample = await getFile(audioCtx, filePath);
    return sample;
}


let playbackRate = 1;
const rateControl = document.querySelector('#rate');
rateControl.addEventListener('input', function(){
    playbackRate = Number(this.value);
}, false);

function playSample(audioContext, audioBuffer){
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.playbackRate.setValueAtTime(playbackRate, audioCtx.currentTime);
    sampleSource.connect(audioContext.destination);
    sampleSource.start();
    return sampleSource;
}

let tempo = 60.0;
const bpmControl = document.querySelector('#bpm');
bpmControl.addEventListener('input', function(){
    tempo = Number(this.value);
}, false);

let lookahead = 25.0;   // How frequently to call scheduler (ms)
let scheduleAheadTime = 0.1; // How far ahead to schedule audio (s)

let currentNote = 0;
let nextNoteTime = 0.0; // When the next note is due;

function nextNote(){
    const secondsPerBeat = 60.0 / tempo;

    nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    // Advance the beat number, wrap to zero
    currentNote++;
    if (currentNote === 4){
        currentNote = 0;
    }
}

const notesInQueue = [];

function scheduleNote(beatNumber, time){
    // push the note on the queue, even if we're not playing
    notesInQueue.push({note: beatNumber, time: time});

    if (pads[0].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true'){
        playSweep();
    } 
    if (pads[1].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true'){
        playPulse();
    } 
    if (pads[2].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true'){
        playNoise();
    } 
    if (pads[3].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true'){
        playSourceNode(audioCtx, sample);
    } 
}

function scheduler(){
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while(nextNoteTime < audioCtx.currentTime + scheduleAheadTime){
        scheduleNote(currentNote, nextNoteTime);
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
}

let lastNoteDrawn = 3;

function draw(){
    let drawNote = lastNoteDrawn;
    let currentTime = audioCtx.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime){
        drawNote = notesInQueue[0].note;
        notesInQueue.splice(0,1);
    }

    if (lastNoteDrawn != drawNote){
        pads.forEach(function(el, i){
            el.children[lastNoteDrawn].style.borderColor = 'hsla(0, 0%, 10%, 1)';
            el.children[drawNote].style.borderColor = 'hsla(49, 99%, 50%, 1)';
        });

        lastNoteDrawn = drawNote;
    }

    // set up to draw again
    requestAnimationFrame(draw);
}


const playButton = document.querySelector('[data-playing]');
let isPlaying = false;
setupSample().then(sample => {
    let dtmf = sample;

    playButton.addEventListener('click', function(){
        isPlaying = !isPlaying;

        if (isPlaying){
            if (audioCtx.state === 'suspended'){
                audioCtx.resume();
            }

            currentNote = 0;
            nextNoteTime = audioCtx.currentTime;
            scheduler();
            requestAnimationFrame(draw);
            this.dataset.playing = 'true';
        } else {
            window.clearTimeout(timerID);
            this.dataset.playing = 'false';
        }
    });
});

