import React from 'react';
import '../css/App.css';
var {Link}=require('react-router-dom');
import axios from 'axios';


export class GameTable extends React.Component{

  constructor(props)
  {
    super(props);
    console.log("USER",this.props.user);
	this.state =
	{
      games: [],
	  filteredGames: [],
      retrieving: false,
	}
  }

  componentDidMount()
  {
    this.retrieveGames();
  }


    updateSearch(event){
      this.updateTable(event.target.value);
    }

    updateTable(search) {
        this.setState({filteredGames : this.state.games.filter(
            (game) => { return ((game.sport.toLowerCase().indexOf(search.toLowerCase()) !== -1)||
            (game.name.toLowerCase().indexOf(search.toLowerCase())!== -1)||
            (game.location.toLowerCase().indexOf(search.toLowerCase()) !== -1));
            })
        });
    }

    retrieveGames() {
        this.setState({retrieving: true});
        axios.post('/retrievegames').then((results)=>{
           let data = results.data.filter(game=>{
                return !game.isprivate
            });
            this.setState({games: data, retrieving: false});
            this.updateTable(this.refs.search.value);


        });


    }


  render() {
    if (this.state.retrieving == true)
    {
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

	   <table className="table table-bordered table-hover">
	   <thead>
       <tr>
	  <th>Activity</th>
	  <th>Name</th>
	  <th>Location</th>
	  <th>Join</th>
    <th>Leave</th>
    <th># Joined</th>
    <th></th>
	</tr>
      </thead>
      <tbody>
	      {
            this.state.filteredGames.map((game)=>{
                return (<Game game = {game} user={this.props.user} key={game.id} />);
            })
         }
	  </tbody>
      </table>
      </div>
	);

  }

}

export class Game extends React.Component {

  joinGame()
  {
    axios.post('/join', {uid:this.props.user, gid:this.props.game.id});
  }
  leaveGame(){
    axios.patch('/games', {uid:this.props.user, gid:this.props.game.id});
  }


  render(){
    return(
        <tr>
          <td>{this.props.game.sport}</td>
          <td>{this.props.game.name}</td>
          <td>{this.props.game.location}</td>
          <td><input  type="button"
            className="btn btn-success btn-md"
            onClick={this.joinGame.bind(this)} value="Join"/></td>
          <td><input type="button"
            className="btn btn-danger btn-md"
            onClick={this.leaveGame.bind(this)} value="Leave"/></td>
          <td>{this.props.game.players.length}</td>
          <td><Link to={"/game:"+this.props.game.id}>Details</Link></td>
        </tr>
    );
  }
}
