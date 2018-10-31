import React, { Component } from 'react';
import './App.css';

import CanvasController from '../visualisation/CanvasController';

class App extends Component {
  constructor(props){
    super(props);

    this.canvas = React.createRef();

  }
  
  componentDidMount(){
    this.canvasController = new CanvasController(this.canvas.current);
    this.canvasController.start();
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
          <canvas ref={this.canvas} id="canvas" width="640" height="480"></canvas>
        </content>
      </div>
    );
  }
}

export default App;
