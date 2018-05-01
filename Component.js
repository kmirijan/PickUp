import React from 'react';
import Axios from 'axios';

export class Component extends React.Component{
	constructor(props) {
			super(props);
			this.state = {
				game: '',
				location: ''
			};

			this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		this.setState({
			game: event.target.game,
			location: this.target.location
		});
		console.log(event.target);
	}

	_handleClick(){
		Axios.post('/api', {
			game: 'basketball',
			location: 'San jose'
		}).then((res) =>{
			console.log(res);
		});
	}

	render() {
		return(
			<html>
				<head>
					<title> Universal App with React</title>
				</head>
				<body>
					<div>
						<h1>Hello World!</h1>
						<p>Isnt server side rendering remarkable?</p>
						<form onSubmit = {this._handleClick}>
							<input type="text" game = {this.state.game}/>
						</form>
					</div>
					<script src = '/bundle.js' />
				</body>
			</html>

		);
	}
};
