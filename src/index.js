import React from 'react';
import ReactDOM from 'react-dom';
import {Routes} from './components/Routes.jsx';
import NavBar from './components/NavBar';
import registerServiceWorker from './registerServiceWorker';


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

registerServiceWorker();
