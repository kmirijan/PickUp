import React from 'react';
import './css/App.css';
import {CurrentGames} from './CurrentGames.js';

export class App extends React.Component {
  render() {
    return (
      <div className="App">
        <ul className="NavBar">
         <li className="Nav"><a class="active" href="#home">Home</a></li>
         <li className="Nav"><a href="#Create Game">Create Game</a></li>
         <li className="Nav"><a href="#Login">Login</a></li>
         <li className="Nav"><a href="#Sign Up">Sign Up</a></li>
        </ul>

        <header className="App-header">
          <img src="/logo.png" className="App-logo" alt="logo" />
          <h1 className="App-title">The Hub for Connecting Players</h1>
        </header>
        <h1 className="App-newGame">
          To setup a pickup game please enter the required information below
        </h1>

      <section className="SubmissionHome">
<CurrentGames games={this.props.games}/>
        </section>
      </div>
    );
  }
}
