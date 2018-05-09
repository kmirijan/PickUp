import React from 'react';
import '../css/App.css';

import axios from 'axios';

function updateTable(search, friend)
{
  axios.post("/usergames", {user:friend}).then((results)=>{
    console.log(results.data);
    this.setState({games: results.data});
    var data = results.data;
    this.setState({filteredGames : data.filter(
      (game) => {
        return ((game.sport.toLowerCase().indexOf(search.toLowerCase()) !== -1)||
          (game.name.toLowerCase().indexOf(search.toLowerCase())!== -1)||
          (game.location.toLowerCase().indexOf(search.toLowerCase()) !== -1));
    })});

  });
}

export class CurrentGamesPrivate extends React.Component{
  constructor(props) {
    super(props);
    console.log(this.props.friend)
    this.state = {
      game: {},
    };
  }

updateSearch(event){
  console.log(this.props.friend)
  updateTable(event.target.value,this.props.friend);
}






  render(){

    return(
      <div>
        <h3>Games Made</h3>
        <input type="text" placeholder="Search"
		  ref="search"
          onChange={this.updateSearch.bind(this)}/>
          <GameTable user={this.props.user} friend={this.props.friend}/>
    </div>
    );
  }
}

class GameTable extends React.Component{

  constructor(props)
  {
    super(props);
	updateTable = updateTable.bind(this);

	this.state =
	{
      games: [],
	  filteredGames: [],
	}
  }

  componentDidMount()
  {
    updateTable("",this.props.friend);
  }

  render() {
    return (
	   <table>
	   <thead>
       <tr>
	  <th><h3>Activity</h3></th>
	  <th><h3>Name</h3></th>
	  <th><h3>Location</h3></th>
	  <th><h3>Join</h3></th>
	</tr>
      </thead>
      <tbody>
	      {
          this.state.filteredGames.map((game)=>{
            return <Game game = {game} user={this.props.user} key={game.id}/>
          })}
	  </tbody>
      </table>
	);

  }

}

class Game extends React.Component{

  constructor(props)
  {
    super(props);
    this.joinGame = this.joinGame.bind(this);
  }

  joinGame()
  {
    axios.post('/join', {uid:this.props.user, gid:this.props.game.id});
  }

  render(){
    return(
        <tr>
          <td ><h3>{this.props.game.sport} </h3></td>
          <td ><h3>{this.props.game.name} </h3></td>
          <td > <h3>{this.props.game.location}</h3> </td>
          <td><button className="joinGame" onClick={this.joinGame}><h3>Join</h3></button></td>
        </tr>
    );
  }
}
