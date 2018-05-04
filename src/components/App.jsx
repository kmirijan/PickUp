import React from 'react';
import '../css/App.css';
import {CurrentGames} from './CurrentGames.jsx';
import NavBar from './NavBar';


class App extends React.Component {
  render() {
    console.log("Rendering App"); // DEBUG
    return (
      <div className="App">
        <NavBar/>

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
