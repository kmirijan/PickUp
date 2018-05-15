import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';
import NavBar from './NavBar';
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');
var axios=require("axios");

class Home extends React.Component {

  render() {
    return (
      <div className>
          <NavBar/>
          <h1 className='HomepageText'>Discover, Connect, Play</h1>
          <h2 className='HomepageSubtext'>PickUp is the easiest way to find members in your community interested in the same sports as you!</h2>
          <p class="texts"><a class="btn btn-primary btn-lg" href="signin" role="button">Sign In</a> to continue the fun or <a class="btn btn-primary btn-lg" href="signup" role="button">Sign Up</a> to join our community!</p>
      </div>
    );
  }
}

export default Home;
