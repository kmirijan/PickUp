import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';
import {CurrentGames} from './CurrentGames';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <ul className="NavBar">
         <li className="Nav"><Link className = 'active' to={'/app'}>Home</Link></li>
         <li className="Nav"><Link className = 'pages' to={'/app'}>Create Game</Link></li>
         <li className="Nav"><Link className = 'pages' to={'/signin'}>Login</Link></li>
         <li className="Nav"><Link className = 'pages' to={'/signup'}>Sign Up</Link></li>
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

export default App;
