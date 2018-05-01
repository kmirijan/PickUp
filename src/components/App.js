import React from 'react';
import '../css/App.css';
import {CurrentGames} from './CurrentGames';
import NavBar from './NavBar';

class App extends React.Component {
  render() {
    return (
      <div className="App">
          <NavBar/>
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

export default App;
