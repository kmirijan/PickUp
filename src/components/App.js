import React from 'react';
import '../css/App.css';
import {CurrentGames} from './CurrentGames.js';
import NavBar from './NavBar';


class App extends React.Component {

  constructor(props)
  {
    super(props);
    console.log("props"); // DEBUG
    console.log(this.props);
  }

  render() {


    return (
      <div className="App">
        <NavBar/>
        <h1 className="App-newGame">
          To setup a pickup game please enter the required information below
        </h1>

      <section className="SubmissionHome">
        <CurrentGames user={this.props.user}/>
        </section>
      </div>
    );
  }
}

export default App;
