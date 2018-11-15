import React from 'react';

const VisualControls = (props) => {
    const {bgFlashing, cube, waveform, handleChange} = {props};
    return (
        <div className="VisualControls">
            <p>Visuals</p>
            <div className="effect-controls">
                <label htmlFor="bgFlashing">Flashing BG</label>
                <input type="checkbox" name="bgFlashing" value={bgFlashing} onChange={handleChange} />

                <label htmlFor="cube">Cube</label>
                <input type="checkbox" name="cube" checked={cube} onChange={handleChange}></input>

                <label htmlFor="waveform">Waveform</label>
                <input type="checkbox" name="waveform" checked={waveform} onChange={handleChange}></input>
              </div>
        </div>
    )
}

export default VisualControls;
