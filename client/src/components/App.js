import React, { Component } from 'react';
import './App.css';

import CanvasController from '../visualisation/CanvasController';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      isPlaying: false,
      selectedSample: '',
      availableSamples: []
    };

    this.canvas = React.createRef();
    this.togglePlay = this.togglePlay.bind(this);
    this.selectSample = this.selectSample.bind(this);
  }
  
  componentDidMount(){
    // TODO: Fetch available sample names from the server and show them in a drop-down etc.
    this.canvasController = new CanvasController(this.canvas.current);
    // this.canvasController.load(`virtual-flesh.mp3`);
    this.canvasController.listenToSpeakerOutput();
  }

  togglePlay(){
    const {isPlaying } = this.state;

    if(isPlaying){
      this.canvasController.pause();
      this.setState({
        isPlaying: false,
      })
    }
    else{
      this.canvasController.play();
      this.setState({
        isPlaying: true
      });
    }
  }

  selectSample(e){
    const sampleName = e.target.value;

    console.log("Selected sample: " + sampleName);

    this.setState({
      isPlaying: false,
      selectedSample: sampleName	// TODO: Is this even needed..?
    });

    this.canvasController.load(sampleName);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Fukken' saved!
          </p>
        </header>
        <content>
          <select className="sample-list" onChange={this.selectSample}>
          {/* TODO: Maybe the sample names need to be shown like the filenames. In that case the selectedSample is needed in the state. */}
            <option value="virtual-flesh.mp3">Virtual Flesh</option> 
            <option value="Humanfobia-Spheres_into_the_abyss.mp3">Humanfobia - Spheres into the abyss</option>
            <option value="dtmf.mp3">Modem dial-up sample</option>
          </select>
          <div className="canvas-container">
            <canvas ref={this.canvas} id="canvas" width="640" height="480"></canvas>
          </div>
          <div className="controls">
            <button id="play" className="button play-button" onClick={this.togglePlay}><span>{this.state.isPlaying ? 'Pause' : 'Play'}</span></button>
          </div>
        </content>
      </div>
    );
  }
}

export default App;
