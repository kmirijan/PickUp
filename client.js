import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import {App} from './App.js';
import {games} from './CurrentGames.js';

ReactDOM.render(<App games={games} />, document.getElementById('root'));
