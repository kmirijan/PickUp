import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';


class NavBar extends React.Component {
  render() {
    return (
      <div>
      <ul className="NavBar">
       <li className="Nav"><Link className = 'active' to={'/'}>Home</Link></li>
       <li className="Nav"><Link className = 'pages' to={'/app'}>Create Game</Link></li>
       <li className="Nav"><Link className = 'pages' to={'/signin'}>Login</Link></li>
       <li className="Nav"><Link className = 'pages' to={'/signup'}>Sign Up</Link></li>
      </ul>
      </div>
    );
  }
}

export default NavBar;
