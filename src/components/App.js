import React from 'react';
import '../css/App.css';
import {CurrentGames} from './CreateGames.jsx';
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
        <CurrentGames user={this.props.user} />
      </div>
    );
  }
}

export default App;
