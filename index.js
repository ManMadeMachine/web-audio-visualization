const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioCtx = new AudioContext();

const audioElement = document.querySelector('audio');
audioElement.crossOrigin = 'false';

const track = audioCtx.createMediaElementSource(audioElement);
const gainNode = audioCtx.createGain();

const pannerOptions = {pan: 0};
const panner = new StereoPannerNode(audioCtx, pannerOptions);

track.connect(gainNode).connect(panner).connect(audioCtx.destination);

const playButton = document.querySelector('button');

playButton.addEventListener('click', function(){
  if (audioCtx.state === 'suspended'){
    audioCtx.resume();
  }

  if (this.dataset.playing === 'false'){
    audioElement.play();
    this.dataset.playing = 'true';
  }
  else if (this.dataset.playing === 'true'){
    audioElement.pause();
    this.dataset.playing = 'false';
  }
}, false);

audioElement.addEventListener('ended', () => {
  playButton.dataset.playing = 'false'
}, false);

const volumeControl = document.querySelector('#volume');

volumeControl.addEventListener('input', function(){
  gainNode.gain.value = this.value;
}, false);

const pannerControl = document.querySelector('#panner');

pannerControl.addEventListener('input', function(){
  panner.pan.value = this.value;
}, false);
