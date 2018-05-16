import React from 'react';
import '../css/App.css';
var {Link}=require('react-router-dom');


import axios from 'axios';

const GUEST = "guest";




export class CurrentGames extends React.Component{



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
            user: this.props.user,
            coords: {
                lat: coords.lat(),
                lng: coords.lng()
            },
        };
        axios.post('/postgames', game).then( () =>
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

                <form
                className="form-inline"
                onSubmit={this.addGame.bind(this)}
                >
                    {this.displayNameInput()}
                    <input
                    className='gameDetails'
                    type="text"
                    ref="sport"
                    placeholder="Activity"/>
                    <input
                    className='gameDetails'
                    id= 'location'
                    type="text"
                    ref="location"
                    placeholder="Location"/>
                    <p>Private</p>
                    <input
                      className='gameDetails'
                      id= 'isprivate'
                     type="checkbox"
                     ref="isprivate"
                     onChange={this.togglePrivate}/>

                    <div className="App-submitButton">
                        <input type="submit" value="Submit"/>
                    </div>
                </form>


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
        <input className = "searchBox"
        type="text" placeholder="Search"
		ref="search"
        onChange={this.updateSearch.bind(this)}/>


        <input type="button" value="Refresh" onClick={this.retrieveGames.bind(this)} />
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
                return (<Game game = {game} user={this.props.user} key={game.id} />);
            })
         }
	  </tbody>
      </table>
      </div>
	);

  }

}

class Game extends React.Component {

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
          <td><button className="joinGame" onClick={this.joinGame.bind(this)}><h3>Join</h3></button></td>
          <td><Link to={"/game:"+this.props.game.id}><h3>Details</h3></Link></td>
        </tr>
    );
  }
}
