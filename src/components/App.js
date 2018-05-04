import React from 'react';
import '../css/App.css';
import {CurrentGames} from './CurrentGames';
import NavBar from './NavBar';

class App extends React.Component {
  render() {
    return (
      <body>
      <div className="App">
          <NavBar/>
        <h2>
          To setup a pickup game please enter the required information below
        </h2>
        <section className="SubmissionHome">
          <CurrentGames games={this.props.games}/>
        </section>
      </div>
    </body>
    );
  }
}

export default App;
