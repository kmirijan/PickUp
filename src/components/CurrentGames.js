import React from 'react';
import '../css/App.css';

import axios from 'axios';

export class CurrentGames extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      games: [],
      game: {},
    };
    this.updateTable = this.updateTable.bind(this);
    this.addGame = this.addGame.bind(this);
  }

updateSearch(event){
  this.setState({search: event.target.value});
  this.updateTable();
}

 componentWillMount()
 {
   this.updateTable();
 }

componentDidMount(){
  new google.maps.places.Autocomplete(document.getElementById('location'));
}

addGame(event) {
  event.preventDefault();
  let sport = this.refs.sport.value;
  let name = this.refs.name.value;
  let location = this.refs.location.value;
  let id = Math.floor((Math.random()*100)+1);
  let user = 100; // TODO change this when users are implemented
  let game = {gameId: id, sport: sport, name: name, location: location, user: user};
  console.log(game);
  axios.post('/postgames', game);
  this.updateTable();
  this.refs.sport.value='';
  this.refs.name.value='';
  this.refs.location.value='';
  }

  updateTable()
  {
    axios.post('/games').then((results)=>{
      this.setState({games: results.data})
    });
  }

  render(){
    console.log(this.state.games);
    let filteredGames = this.state.games.filter(
      (game) => {
        return ((game.sport.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1)||
          (game.name.toLowerCase().indexOf(this.state.search.toLowerCase())!== -1)||
          (game.location.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1));
      }
    );
    return(
      <div>

        <form
         className="form-inline"
         onSubmit={this.addGame.bind(this)}
       >
            <input
              type="text"
              ref="sport"
              placeholder="Activity"/>
            <input
              type="text"
              ref="name"
              placeholder="Name"/>
           <input
             id= 'location'
              type="text"
              ref="location"
              placeholder="Location"/>

            <div className="App-submitButton">
              <input type="submit" value="Submit"/>
            </div>

          </form>

        <input type="text" placeholder="Search"
          value={this.state.search}
          onChange={this.updateSearch.bind(this)}/>
          <h1 className="App-currentGames">
            Below are the currently available games:
          </h1>
      <ul>
          {filteredGames.map((game)=>{
            return <Game game = {game} key={game.id}/>
          })}
      </ul>
    </div>
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
