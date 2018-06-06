import React from 'react';
import '../css/App.css';
var {Link}=require('react-router-dom');
import axios from 'axios';
import {CreateGames} from './CreateGames';

export class GameTable extends React.Component{
  
  constructor(props) {
    super(props);
    console.log("USER",this.props.user);
  	this.state =
  	{
        games: [],
        allGames:[],
  	    filteredGames: [],
        retrieving: false,
        defaultSearch:null,
  	}
    if(this.props.defaultSearch!=null) {
      this.state.defaultSearch=this.props.defaultSearch;
    }
  }

  // Obtain the games from the server after mounting
  componentDidMount() {
    this.retrieveGames();
  }

  // Update the table when the search terms change
  updateSearch(event) {
    this.updateTable(event.target.value);
  }

  // Refilter the games based on 'search'
  updateTable(search) {
    this.setState({filteredGames : this.state.games.filter(
      (game) => { return ((game.sport.toLowerCase().indexOf(search.toLowerCase()) !== -1)||
      (game.name.toLowerCase().indexOf(search.toLowerCase())!== -1)||
      (game.location.toLowerCase().indexOf(search.toLowerCase()) !== -1))||
      (String(game.id).indexOf(String(search))!==-1);
      })
    });
  }

  // Allow the table to pick out games by ID
  // Used for obtaining a specific game, e.g. from a user's profile
  updateTableAll(search) {
    this.setState({filteredGames : this.state.allGames.filter(
      (game) => { return(String(game.id).indexOf(String(search))!==-1)

      })
    });
  }

  // Retrieves the games from the server then updates the table
  retrieveGames() {
    this.setState({retrieving: true});
    axios.post('/retrievegames').then((results)=>{
     let data = results.data.filter(game=>{
        return !game.isprivate
      });
      this.setState({games: data, allGames:results.data,retrieving: false});
      if(this.state.defaultSearch==null){
        this.updateTable(this.refs.search.value);
      }
      else{
        this.updateTableAll(this.state.defaultSearch);
        this.setState({defaultSearch:null});
      }
    });
  }

  /* Retrieves the games from server and calls a function to alert the parent
      that a new game has been created
  */
  reloadAll() {
    if (this.props.onNewGame != undefined) {
      this.props.onNewGame();
    }
    this.retrieveGames();
  }

  // Only reloads the table, not anything else
  reloadSelf() {
    this.retrieveGames();
  }

  // Displays the games in a table or a loading message if the games are being retrieved
  render() {
    if (this.state.retrieving == true) {
        return (<h2 className="retrieving">Retrieving Games...</h2>);
    }
    else return (
      <div>
        <div className="searchBox">
          <input className="form-control" type="text"
            placeholder="Search"
		          ref="search"
        onChange={this.updateSearch.bind(this)}/>

        <input className = "btn btn-primary" type="button" value="Refresh"
          onClick={this.retrieveGames.bind(this)}
          style={{margin:"auto"}}/>
    </div>


    <div className="container">
      <button type="button" className="btn btn-primary" data-toggle="collapse"
        data-target="#createSoloGames">Create A Game</button>
      <div id="createSoloGames" className="collapse">
      <CreateGames onNewGame={this.reloadAll.bind(this)} user={this.props.user}/>
        </div>
      </div>


	   <table className="table table-bordered table-hover">
	   <thead>
       <tr>
	  <th>Activity</th>
	  <th>Name</th>
	  <th>Location</th>
    <th>Join/Leave</th>
    <th># Joined</th>
    <th></th>
	</tr>
      </thead>
      <tbody>
	      {
            this.state.filteredGames.map((game)=>{
              return (<Game game = {game} onParticipationChange={this.reloadSelf.bind(this)}
                user={this.props.user} key={game.id} />);
            })
         }
	  </tbody>
      </table>
      </div>
	   );
  }
}

export class Game extends React.Component {

  // Joins the game with the active user and alerts the parent that it changed
  joinGame() {
    axios.patch('/game:user', {uid: this.props.user, gid: this.props.game.id});
    axios.patch('/user:game', {uid: this.props.user, gid: this.props.game.id});
    if (this.props.onParticipationChange != undefined) {
      this.props.onParticipationChange();
    }
  }

  // Leaves the game for the active user and alerts the parent that it changed
  leaveGame() {
    axios.patch('/leave:games', {uid:this.props.user, gid:this.props.game.id});
    if (this.props.onParticipationChange != undefined) {
      this.props.onParticipationChange();
    }
  }

  /* Returns either a Join button or Leave button depending on 
      if the active user is already in the game
  */
  getJoinLeaveButton() {
    if (this.props.game.players.includes(this.props.user)) {
      return (
        <input type="button"
          className="btn btn-danger btn-md"
          onClick={this.leaveGame.bind(this)} value="Leave"/>
      );
    }
    else {
      return (
        <input  type="button"
          className="btn btn-success btn-md"
          onClick={this.joinGame.bind(this)} value="Join"/>
      );
    }
  }

  // Display the game's data and a join/leave button
  render(){
    return(
        <tr>
          <td>{this.props.game.sport}</td>
          <td>{this.props.game.name}</td>
          <td>{this.props.game.location}</td>
          <td>{this.getJoinLeaveButton()}</td>
          <td>{this.props.game.players.length}</td>
          <td><Link to={"/game:"+this.props.game.id}>Details</Link></td>
        </tr>
    );
  }
}
