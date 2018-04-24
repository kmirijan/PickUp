import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import {App} from './App.js';
import {games} from './CurrentGames.js';

console.log("this works");
ReactDOM.render(<App games={games}/>, document.getElementById('root'));
