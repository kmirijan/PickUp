import React from 'react';
import '../css/App.css';
var {Top, Rest} =require("./Main.jsx");
import {CurrentGames} from './CurrentGames.jsx';


class App extends React.Component {
  render() {
    console.log("Rendering App"); // DEBUG
    return (
      <div className="App">
        <header className="App-header">
          <img src="/logo.png" className="App-logo" alt="logo" />
          <h1 className="App-title">The Hub for Connecting Players</h1>
        </header>
        <h1 className="App-newGame">
          To setup a pickup game please enter the required information below
        </h1>

      <section className="SubmissionHome">
        <CurrentGames user={this.props.match.params.username}/>
        </section>
      </div>
    );
  }
}

export default App;
