import React from 'react';
import './App.css';
import Game from './Game';
import logo from './logo.png'

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <div id="console">
              <div id="rectangle">
                  <img id="logo" src={logo}/>
              </div>
              <div id="firsttrapez"></div>

              <div id="rectanglecenter">
                  <div id="rectangleframe">
                      <div id="toptrapez"></div>
                      <div id="display">
                          <Game />
                      </div>
                      <div id="bottomtrapez"></div>
                  </div>
              </div>
              <div id="lasttrapez">

              </div>
          </div>
      </header>
    </div>
  );
}

export default App;
