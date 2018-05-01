import React from 'react';
import {NavLink} from 'react-router-dom';
import '../css/App.css';


class NavBar extends React.Component {
  render() {
    if(localStorage.getItem("loggedin")=="true"){
      return (
        <div>
        <ul className="NavBar">
         <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/home'}>Home</NavLink></li>
         <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/app'}>Create Game</NavLink></li>
         <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/logout'}>Log Out</NavLink></li>
         <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/users'}>Users</NavLink></li>

        </ul>
        </div>
      )
    }
    else{
      return (
        <div>
        <ul className="NavBar">
         <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/home'}>Home</NavLink></li>
         <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/app'}>Create Game</NavLink></li>
         <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/signin'}>Sign In</NavLink></li>
         <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/signup'}>Sign Up</NavLink></li>
         <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/users'}>Users</NavLink></li>

        </ul>
        </div>
      )
    }
  }
}

export default NavBar;