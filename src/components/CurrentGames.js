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

  componentDidMount() {
    this.retrieveGames();
  }

  updateSearch(event) {
    this.updateTable(event.target.value);
  }

  updateTable(search) {
    this.setState({filteredGames : this.state.games.filter(
      (game) => { return ((game.sport.toLowerCase().indexOf(search.toLowerCase()) !== -1)||
      (game.name.toLowerCase().indexOf(search.toLowerCase())!== -1)||
      (game.location.toLowerCase().indexOf(search.toLowerCase()) !== -1))||
      (String(game.id).indexOf(String(search))!==-1);
      })
    });
  }

  updateTableAll(search) {
    this.setState({filteredGames : this.state.allGames.filter(
      (game) => { return(String(game.id).indexOf(String(search))!==-1)

      })
    });
  }

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

  reloadAll() {
    console.log("Reloading Game table");
    if (this.props.onNewGame != undefined) {
      console.log("Updating boss of GameTable");
      this.props.onNewGame();
    }
    this.retrieveGames();
  }

  reloadSelf() {
    this.retrieveGames();
  }

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
  joinGame() {
    axios.patch('/game:user', {uid: this.props.user, gid: this.props.game.id});
    axios.patch('/user:game', {uid: this.props.user, gid: this.props.game.id});
    if (this.props.onParticipationChange != undefined) {
      this.props.onParticipationChange();
    }
  }

  leaveGame() {
    axios.patch('/leave:games', {uid:this.props.user, gid:this.props.game.id});
    if (this.props.onParticipationChange != undefined) {
      this.props.onParticipationChange();
    }
  }

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
  getWeather(lat,lng){
    console.log("lat",lat,"lng",lng)
    axios({
      url:"/getweather",
      method:"post",
      data:{
        lat:lat,
        lng:lng
      }
    }).then((res)=>{
      if(res.data.error!="none"){
        alert(res.data.error);
      }
      else{
        let message=res.data.summary+", "+res.data.temperature+" degrees"
        alert(message)
      }
    })
  }
  render(){
    return(
        <tr>
          <td>{this.props.game.sport}</td>
          <td>{this.props.game.name}</td>
          <td>{this.props.game.location}</td>
          <td>{this.getJoinLeaveButton()}</td>
          <td>{this.props.game.players.length}</td>
          <td>
            <input
              type="button"
              className="btn btn-danger btn-md"
              onClick={
                ()=>{
                  this.getWeather(this.props.game.coords.coordinates[0],this.props.game.coords.coordinates[1])
                }
              }
              value="raincheck"
            />
          </td>

          <td><Link to={"/game:"+this.props.game.id}>Details</Link></td>
        </tr>
    );
  }
}
