import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';
import NavBar from './NavBar';
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');
var axios=require("axios");

class Home extends React.Component {

  render() {
    return (
      <div className="home">
          <NavBar/>
          <div className="mainDiv">
            <img src="/background.png" className="jumbotron" alt="background"/>
            <div className='centerText'>

              <h1 className='HomepageText'>Discover, Connect, Play</h1>
              <p>PickUp is the easiest way to find members in your community interested in the same sports as you!</p>
              
              <p><a className="btn btn-primary btn-lg" href="signin" role="button">Sign In</a></p>
            </div>
          </div>
      </div>
    );
  }
}

export default Home;
