import React from 'react';
import '../css/App.css';
var {Link}=require('react-router-dom');
import NavBar from "./NavBar"
import axios from 'axios';

const GUEST = "guest";

export class CurrentTeamGames extends React.Component{



    constructor(props) {
        super(props);
        this.state = {
            game: {},
            isprivate:false
        };
        this.addGame = this.addGame.bind(this);
        this.togglePrivate=this.togglePrivate.bind(this);
    }
    componentDidMount() {
           let input = document.getElementById('location');
           this.autocomplete = new google.maps.places.Autocomplete(input);
    }




    getName()
    {
        if (this.props.user != GUEST)
        {
            return this.props.user;
        }
        else
        {
            return this.refs.name.value;
        }
    }

    getName()
    {
        if (this.props.user != GUEST)
        {
            return this.props.user;
        }
        else
        {
            return this.refs.name.value;
        }
    }

    addGame(event) {
        event.preventDefault();
        let sport = this.refs.sport.value;
        let name = this.getName();
        let location = this.refs.location.value;
        let isprivate = this.state.isprivate;
        let coords = this.autocomplete.getPlace().geometry.location;
        let id = Math.floor((Math.random()*(1 << 30))+1);
        let game = {
            gameId: id,
            sport: sport,
            name: name,
            isprivate:isprivate,
            location: location,
            user: localStorage.getItem("user"),
            coords: {
                lat: coords.lat(),
                lng: coords.lng()
            },
        };
        console.log(game);
        axios.post('/postgamesT', game).then( () =>
                {alert("Game added. It will appear upon refreshing the games table")});
        this.refs.sport.value='';
        this.refs.name.value='';
        this.refs.location.value='';
    }
    togglePrivate(){
      if(this.state.isprivate==false){
        this.setState({
          isprivate:true
        })
      }
      else{
        this.setState({
          isprivate:false
        });
      }
    }


    displayNameInput()
    {
        if (this.props.user != GUEST)
        {
            return null;
        }
        else
        {
            return (
                <input
                className='gameDetails'
                type="text"
                ref="name"
                placeholder="Name"
                />

            );
        }
    }

    render(){

        return(
            <div>
                <NavBar/>

                  <div className="container">
                    <button type="button" className="btn btn-primary" data-toggle="collapse"
                      data-target="#createTeamGames">Create A Team Game</button>


                    <div id="createTeamGames" className="collapse">
                        <div className="row main">
                          <div className="panel-heading">
                           <div className="panel-title text-center">
                              <h1 className="title">Create a team game below:</h1>
                              <hr />
                            </div>
                        </div>
                        <div className="main-create main-center">
                    <form className="form-horizontal"
                      onSubmit={this.addGame.bind(this)}>

                      <div className="form-group">
                        <label className="cols-sm-2 control-label">Activity</label>
                        <div className="cols-sm-10">
                          <div className="input-group">
                            <span className="input-group-addon"></span>
                            <input className='teamDetails form-control' type="text"  type="text"
                            ref="sport"
                            placeholder="Activity"/>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="cols-sm-2 control-label">City</label>
                        <div className="cols-sm-10">
                          <div className="input-group">
                            <span className="input-group-addon"></span>
                            <input className='teamDetails form-control' type="text"  type="text"
                              id= 'location'
                              ref="location"
                              placeholder="Location"/>
                          </div>
                        </div>
                      </div>


                      <div className="form-group">

                      <div>
                        <input type="submit" className="btn btn-primary" value="Create"/>
                        <span></span>
                        <input type="reset" className="btn btn-default" value="Clear"/>
                      </div>
                      </div>
                    </form>
                  </div>
                </div>

        </div>
        </div>

                <h1 className="App-currentGames">
                  Below are the currently available games:
                </h1>
            <GameTable user={this.props.user} />
            </div>
        );

    }
}

class GameTable extends React.Component{

  constructor(props)
  {
    super(props);
  	this.state =
  	{
        games: [],
  	  filteredGames: [],
      userTeams:[],
        retrieving: false,
  	}
    this.userTeams=this.userTeams.bind(this);
  }

  componentDidMount()
  {
    this.retrieveGames();
    this.userTeams();
  }
  userTeams(){

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
        axios.post('/retrievegamesT').then((results)=>{
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
                return (<Game  userGames={this.props.userGames} game = {game} user={this.props.user} key={game.id} />);
            })
         }
    </tbody>
      </table>
      </div>

	);

  }

}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.showTeamGames=this.showTeamGames.bind(this);
  }
  joinGame()
  {
    axios.post('/joinT', {uid:this.props.user, gid:this.props.game.id});
  }
  leaveGame(){
    axios.patch('/gamesT', {uid:this.props.user, gid:this.props.game.id});
  }
  showTeamGames(){

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
          onClick={this.leaveGame.bind(this)} value="Leave"/>
          <div>
            {this.showTeamGames()}
          </div>
    </td>
        <td>{this.props.game.players.length}</td>
        <td><Link to={"/tgame:"+this.props.game.id}>Details</Link></td>
      </tr>

    );
  }
}
module.exports={
  CurrentTeamGames
}
