import React from 'react';
import '../css/App.css';
import {CreateGames} from './CreateGames.jsx';
import NavBar from './NavBar';


class App extends React.Component {

  constructor(props) {
    super(props);
    console.log("USER",this.props.user);
    console.log("props"); // DEBUG
    console.log(this.props);
  }

  render() {
    return (
      <div className="App">
        <NavBar user={this.props.user}/>
        <CurrentGames user={this.props.user} />
      </div>
    );
  }
}

export default App;
