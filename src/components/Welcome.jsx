import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');
var axios=require("axios");


class Welcome extends React.Component{
  constructor(props){
    super(props);
    console.log("USER",this.props.user);
  }

  render(){
    return(
    <div>
      <h1>Welcome, {this.props.user},!</h1>
      <div><Link to={'/map'}>BEGIN PLAYING</Link></div>
  </div>
    );
  }
}

export default Welcome;
