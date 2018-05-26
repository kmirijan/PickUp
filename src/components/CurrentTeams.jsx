import React from 'react';
import '../css/App.css';
import NavBar from "./NavBar"
var {Link}=require('react-router-dom');


import axios from 'axios';

const GUEST = "guest";


class CurrentTeams extends React.Component{



    constructor(props) {
        super(props);
        console.log("USER",this.props.user);
        console.log("rendered")
    }

    render(){
        return(
            <div>
                <NavBar user={this.props.user}/>
                <h1>Page where you can join teams.</h1>
            </div>
        );

    }
}
module.exports={
  CurrentTeams
}
