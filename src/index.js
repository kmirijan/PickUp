import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route} from 'react-router';
import { BrowserRouter } from 'react-router-dom'
import './css/index.css';
import NavBar from './components/NavBar';
import App from './components/App';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import {games} from './components/CurrentGames';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
    <div>
    <Route path="/" component={NavBar}/>
    <Route path="/app" render={()=><App games={games}/>}/>
    <Route path="/signin" component={SignIn}/>
    <Route path="/signup" component={SignUp}/>
    </div>
  </BrowserRouter>, document.getElementById('root')
);
registerServiceWorker();
