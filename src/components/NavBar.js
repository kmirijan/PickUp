import React from 'react';
import {NavLink, Link} from 'react-router-dom';
import '../css/App.css';

class NavBar extends React.Component {
  render() {
    if(localStorage.getItem("loggedin")=="true"){
      return (
        <div>
          <nav className="navbar navbar-default">
            <ul className="NavBar">
              <li className="Nav"><Link to={'/home'}><img src="logo.png" style={{width:'50px'}}/></Link></li>

              <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/app'}>Create Games</NavLink></li>
              <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/teams'}>Join Teams</NavLink></li>
              <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/teamgames'}>Team Games</NavLink></li>

              <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/list_users'}>Users</NavLink></li>
              <li className="Nav"><NavLink activeClassName='active' className = 'pages' to={'/map'}>Map</NavLink></li>
              <ul>
                <li className="NavIcons"><NavLink to={'/logout'} style={{color:'white'}} activeClassName='active' className = 'pages'>
                  <span className="glyphicon glyphicon-log-in" style={{color:'white'}}></span> Logout</NavLink></li>
                <li className="NavIcons"><NavLink to={'/user:'+localStorage.getItem("user")} style={{color:'white'}} activeClassName='active' className = 'pages'>
                  <span className="glyphicon glyphicon-user" style={{color:'white'}}></span> Profile</NavLink></li>
              </ul>
            </ul>
          </nav>
        </div>
      )
    }
    else{
      return (
        <div>

          <nav className="navbar navbar-default">
            <ul className="NavBar">
              <li className="Nav"><Link to={'/home'}><img src="logo.png" style={{width:'50px'}}/></Link></li>
              <ul>
                <li className="NavIcons"><NavLink to={'/signin'} style={{color:'white'}} activeClassName='active' className = 'pages'>
                  <span className="glyphicon glyphicon-log-in" style={{color:'white'}}></span> Signin</NavLink></li>
                <li className="NavIcons"><NavLink to={'/signup'} style={{color:'white'}} activeClassName='active' className = 'pages'>
                  <span className="glyphicon glyphicon-log-in" style={{color:'white'}}></span> SignUp</NavLink></li>
              </ul>
            </ul>
          </nav>
        </div>
      )
    }
  }
}

export default NavBar;
