import React from 'react';
import '../css/App.css';
import {CurrentGames} from './CurrentGames.jsx';
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
      <body>
      <div className="App">
          <NavBar/>
        <h2>
          To setup a pickup game please enter the required information below
        </h2>
        <section className="SubmissionHome">
          <CurrentGames user="username" games={this.props.games}/>
        </section>
      </div>
    </body>
    );
  }
}

export default App;