import React from 'react';
import '../css/App.css';
import {CurrentGames} from './CurrentGames';
var {Routes,_404}=require("./Routes.jsx");
import NavBar from './NavBar';

class App extends React.Component {
  componentWillMount(){
    if(!(localStorage.getItem("loggedin")=="true")){
     this.props.history.push("/signin");
     alert("Must be logged in to play");
    }
  }
  render() {
      return (
        <div className="App">
          <NavBar/>
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