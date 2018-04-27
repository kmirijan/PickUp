//const React = require('react'),
//	ReactDOM = require('react-dom');

import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class HTML extends React.Component
{
	render()
	{
		const {element, inner} = this.props;
		const Element = element;
		return(
			<Element {...this.props} dangerouslySetInnerHTML={{__html: inner}} />
		);
	}
}

// test
ReactDOM.render(<HTML id='word' className='name' element='div' inner="test text" />, document.getElementById('GameInput'));


class GameInput extends React.Component
{
	constructor(props)
	{
		super(props);

		this.handleGameName = this.handleGameName.bind(this);
		this.handleLocation = this.handleLocation.bind(this);
		this.handleActivity = this.handleActivity.bind(this);
		this.addGame = this.addGame.bind(this);

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
		console.log("name changed");
	}
	handleLocation (event)
	{
		this.setState({loc: event.target.value});
		console.log("location changed");
	}
	handleActivity (event)
	{
		this.setState({activity: event.target.value});
		console.log("activity changed");
	}

	
	addGame (event) 
	{
		console.log(this.state);
		event.preventDefault();
		this.setState(
			{
				loc: event.target.value,
				activity: event.target.value,
				name: event.target.value
			});

		axios.post('/games', this.state)
		this.setState({loc: "", activity: "", name: ""});
		console.log("post sent");
		updateTable();
	};
	
	render()
	{
		return(
		<div>
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
				id='location'
				value={this.state.loc}
				placeholder="Location"
			/>
			<button
				type="submit"
				onClick={this.addGame}
			>
			Add game
			</button>
		</div>
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
			games: [{name: "dee", activity: "la", loc: "da"}]
		};
		updateTable = updateTable.bind(this);
	}

	componentDidMount()
	{
		updateTable();
	}
	

	render()
	{
		console.log("rendering ActiveGames table");
		return (
			<table >
				<tr>
					<th>Sport</th>
					<th>Game Name</th>
					<th>Location</th>
				</tr>
				{this.state.games.map((game) => {return <Game game={game}/>})}
			</table>
		)
	}

}

function updateTable()
{
	axios.get('/games').then((results) => {this.setState({games: results.data});});
}

class Game extends React.Component
{
	render ()
	{
		console.log("rendering Game");
		return (
			<tr>
				<td>{this.props.game.activity}</td>
				<td>{this.props.game.name}</td>
				<td>{this.props.game.loc}</td>
			</tr>
		)
	}
}


let table = {};

ReactDOM.render(
	<ActiveGames />,
	document.getElementById('GameTable')
);
ReactDOM.render(
<GameInput />,
document.getElementById('GameInput')
);
