import React from 'react';
import '../css/App.css';

export let games=[];

export class CurrentGames extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      games: props.games
    };
  }

updateSearch(event){
  this.setState({search: event.target.value});
}

addGame(event) {
  event.preventDefault();
  let sport = this.refs.sport.value;
  let name = this.refs.name.value;
  let location = this.refs.location.value;
  let id = Math.floor((Math.random()*100)+1);
  this.setState({
    games: this.state.games.concat({id, sport, name, location})
  })
  this.refs.sport.value='';
  this.refs.name.value='';
  this.refs.location.value='';
}

  render(){
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
              className="gameDetails"
              type="text"
              ref="sport"
              placeholder="Activity"/>
            <input
              className="gameDetails"
              type="text"
              ref="name"
              placeholder="Name"/>
           <input
             className="gameDetails"
             id= 'location'
              type="text"
              ref="location"
              placeholder="Location"/>

            <div className="App-submitButton">
              <input
                type="submit"
                value="Submit"/>
            </div>

          </form>

        <input
          className="searchBox"
          type="text"
          placeholder="Search"
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
  render(){
    return(
      <div>
      <li className="GamesList">
      <h3 className= "Activity"> Activity: {this.props.game.sport} </h3>
      <h3 className= "Name"> Name: {this.props.game.name} </h3>
      <h3 className= "Location"> Location: {this.props.game.location} </h3>
          </li>
        </div>
    );
  }
}
