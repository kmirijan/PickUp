import React from 'react'
import ReactDOM from 'react-dom'
import Head from './components/Head.js'

var Head=React.createClass({
	render:()=>{
      return(
         <h1>Pickup</h1>
      );
   }
});

const head1=document.getElementById("head1");
const head2=document.getElementById("head2");
ReactDOM.render(<Head/>,head1);
ReactDOM.render(<Head/>,head2);