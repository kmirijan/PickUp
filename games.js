//const React = require('react'),
//	ReactDOM = require('react-dom');

import React from 'react';

class GameInput extends React.Component
{
	constructor(props)
	{
		super(props);
		
		this.handleGameName = this.handleGameName.bind(this);
		this.handleLocation = this.handleLocation.bind(this);
		this.handleActivity = this.handleActivity.bind(this);

		this.state = 
		{	
			loc: "",
			activity: "",
			name: ""
		};
	}

	handleGameName (event)
	{
		this.setState({name: event.target.value});
	}
	handleLocation (event)
	{
		this.setState({loc: event.target.value});
	}
	handleActivity (event)
	{
		this.setState({activity: event.target.value});
	}
	
	addGame = event => 
	{
		event.preventDefault();
		this.setState(
			{
				loc: event.target.value,
				activity: event.target.value,
				name: event.target.value
			});
		
		axios.post('localhost:3000', this.state)
		this.setState({loc: "", activity: "", name: ""});
	};

	render()
	{
		return 
		(
			<input
				onChange={this.handleActivity}
				name="activity"
				value={this.state.activity}
				placeholder="Sport"
			/>
			<input
				onChange={this.handleGameName}
				name="name"
				value={this.state.name}
				placeholder="Game Name"
			/>
			<input
				onChange={this.handleLocation}
				name="loc"
				id="loc"
				value={this.state.loc}
				placeholder="Location"
			/>
			<button
				type="submit"
				onClick={this.addGame}
			>
			Add game
			</button>
		
		);
	
	}
}



class ActiveGames extends React.Component 
{
	constructor(props)
	{
		super(props);

		this.state = 
		{
			games: ""
		};

	}

	componentDidMount()
	{
		fetch('pickupcs115.heroku.com').then(results => return results.json());
		/*
		data.map ((msg) => 
			return (
				<tr> key={msg.}	
			);
		*/
	}

	render()
	{
		return
		(
			<table style="width:100%">
				<tr>
					<th>Sport</th>
					<th>Game Name</th>
					<th>Location</th>
				</tr>
				{data.map((game) => return(<Game game={game}/>))}
			</table>
		)
	}

}

class Game extends React.Component
{
	render ()
	{
		return 
		(
			<tr>
				<td>{this.props.game.activity}</td>				
				<td>{this.props.game.name}</td>
				<td>{this.props.game.loc}</td>
			</tr>
		)
	}
}


ReactDOM.render(
	<GameInput />,
	document.getElementById('GameInput')
);

ReactDOM.render()
	<ActiveGames />,
	document.getElementById('GameTable')
);

