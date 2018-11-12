import React, { Component } from 'react';
import './App.css';

import CanvasController from '../visualisation/CanvasController';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      isPlaying: false,
      selectedSample: '',
      availableSamples: [],
      bgFlashing: false,
      cube: false
    };

    this.canvas = React.createRef();
    this.togglePlay = this.togglePlay.bind(this);
    this.selectSample = this.selectSample.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount(){
    // TODO: Fetch available sample names from the server and show them in a drop-down etc.
    this.canvasController = new CanvasController(this.canvas.current);
    // this.canvasController.load(`virtual-flesh.mp3`);
    this.canvasController.listenToSpeakerOutput();
  }

  handleChange(e){
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    this.setState({
      [name]: value
    });
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bgFlashing !== this.state.bgFlashing){
      this.canvasController.setBgFlashing(this.state.bgFlashing);
    }

    if (prevState.cube !== this.state.cube){
      this.canvasController.setCube(this.state.cube);
    }
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
          <select className="sample-list" onChange={this.selectSample} hidden>
          {/* TODO: Maybe the sample names need to be shown like the filenames. In that case the selectedSample is needed in the state. */}
            <option value="virtual-flesh.mp3">Virtual Flesh</option> 
            <option value="Humanfobia-Spheres_into_the_abyss.mp3">Humanfobia - Spheres into the abyss</option>
            <option value="dtmf.mp3">Modem dial-up sample</option>
          </select>
          <div className="center">
            <canvas ref={this.canvas} id="canvas" width="1024" height="768"></canvas>
            {/* TODO: Create a new component from these and tie them into state */}
            <div className="visual-controls">
              <div className="effect-controls">
                <label htmlFor="bgFlashing">Flashing BG ({this.state.bgFlashing.toString()})</label>
                <input type="checkbox" name="bgFlashing" value={this.state.bgFlashing} onChange={this.handleChange} />

                <label htmlFor="cube">Cube</label>
                <input type="checkbox" name="cube" checked={this.state.cube} onChange={this.handleChange}></input>
              </div>
              <div className="bg-color-controls">
                <h5>Background color values:</h5>
                <div>
                  <label htmlFor="red">Red: </label>
                  <input name="red" type="range" defaultValue="0" min="0" max="255" step="1" />
                </div>
                <div>
                  <label htmlFor="green">Green: </label>
                  <input name="green" type="range" defaultValue="0" min="0" max="255" step="1" />
                </div>
                <div>
                  <label htmlFor="blue">Blue: </label>
                  <input name="blue" type="range" defaultValue="0" min="0" max="255" step="1" />
                </div>
              </div>
            </div>
          </div>
          <div className="controls" hidden>
            <button id="play" className="button play-button" onClick={this.togglePlay}><span>{this.state.isPlaying ? 'Pause' : 'Play'}</span></button>
          </div>
        </content>
      </div>
    );
  }
}

export default App;
