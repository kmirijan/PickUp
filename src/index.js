<<<<<<< HEAD
var React=require("react");
var ReactDOM=require("react-dom");

var {Top,Rest}=require("./components/Main.jsx");
var {Routes}=require("./components/Routes.jsx");
import NavBar from './components/NavBar';




class Everything extends React.Component{
	render(){
		return(
			<div>
				<Routes />
			</div>

			);
	}
}; 

ReactDOM.render(
  <Everything />,
  document.getElementById("body")
);
=======
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route} from 'react-router';
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './css/index.css';
import NavBar from './components/NavBar';
import App from './components/App';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import {games} from './components/CurrentGames';
import registerServiceWorker from './registerServiceWorker';

function authentication(){
if(user){
  this.context.history.push('/app');
}else{
  this.context.history.replace('/signin');
}
}


ReactDOM.render(
  <BrowserRouter basename="/">
    <div>
    <Route path="/" component={NavBar}/>
    <Route path="/home" component={NavBar}/>
    <Route path="/app" render={()=><App games={games}/>}/>
    <Route path="/signin" component={SignIn}/>
    <Route path="/signup" component={SignUp}/>
    </div>
  </BrowserRouter>, document.getElementById('root')
);
registerServiceWorker();
>>>>>>> rogelio
