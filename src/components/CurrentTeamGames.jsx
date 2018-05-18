import React from 'react';
import '../css/App.css';
import NavBar from "./NavBar"
var {Link}=require('react-router-dom');


import axios from 'axios';

const GUEST = "guest";


class CurrentTeamGames extends React.Component{
    constructor(props) {
        super(props);
        console.log("rendered")
    }

    render(){
        return(
            <div>
                <NavBar/>
                <h1>Page where you can join Team Games</h1>
            </div>
        );

    }
}
module.exports={
  CurrentTeamGames
}
