import React, { Component } from 'react';
import './App.css';

import CanvasController from '../visualisation/CanvasController';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      bgFlashing: false,
      cube: false,
      waveform: false
    };

    this.canvas = React.createRef();
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount(){
    // TODO: Fetch available sample names from the server and show them in a drop-down etc.
    this.canvasController = new CanvasController(this.canvas.current);
    this.canvasController.listenToSpeakerOutput();
  }

  handleChange(e){
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    this.setState({
      [name]: value
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bgFlashing !== this.state.bgFlashing){
      this.canvasController.setBgFlashing(this.state.bgFlashing);
    }

    if (prevState.cube !== this.state.cube){
      this.canvasController.setCube(this.state.cube);
    }

    if (prevState.waveform !== this.state.waveform){
      this.canvasController.setWaveform(this.state.waveform);
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
          <div className="center">
            <canvas ref={this.canvas} id="canvas" width="1024" height="768"></canvas>
            {/* TODO: Create a new component from these and tie them into state */}
            <div className="visual-controls">
              <div className="effect-controls">
                <label htmlFor="bgFlashing">Flashing BG</label>
                <input type="checkbox" name="bgFlashing" value={this.state.bgFlashing} onChange={this.handleChange} />

                <label htmlFor="cube">Cube</label>
                <input type="checkbox" name="cube" checked={this.state.cube} onChange={this.handleChange}></input>

                <label htmlFor="waveform">Waveform</label>
                <input type="checkbox" name="waveform" checked={this.state.waveform} onChange={this.handleChange}></input>
              </div>
              <div className="bg-color-controls">
                <h5>Background color values (TBD):</h5>
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
