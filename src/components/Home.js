import React from 'react';
import ReactDOM from 'react-dom';
import '../css/App.css';
import NavBar from './NavBar';
import {Switch,BrowserRouter,Route,browserHistory, Link} from 'react-router-dom';
import axios from 'axios';

class Home extends React.Component {

  render() {
    return (
      <div className>
          <NavBar/>
          <h1 className='HomepageText'>Discover, Connect, Play</h1>
          <h2 className='HomepageSubtext'>PickUp is the easiest way to find members in your community interested in the same sports as you!</h2>
          <p className="texts"><a className="btn btn-primary btn-lg" href="signin" role="button">Sign In</a> to continue the fun or <a className="btn btn-primary btn-lg" href="signup" role="button">Sign Up</a> to join our community!</p>
      </div>
    );
  }
}

export default Home;
