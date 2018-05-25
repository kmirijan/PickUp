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
            isprivate:false,
            playerteams:[],
            teamselected:null
        };
        this.addGame = this.addGame.bind(this);
        this.togglePrivate=this.togglePrivate.bind(this);
        this.selectTeam=this.selectTeam.bind(this);
        this.teamDropDown=this.teamDropDown.bind(this);
        this.ownedteams=[];
        this.teamSelected=this.teamSelected.bind(this);
        axios({
          method:"post",
          url:"/retrieveplayerteams",
          data:{
            user:localStorage.getItem("user")
          }
        }).then((res)=>{
          this.playerteams=res.data;
          console.log(this.playerteams);
        })
    }
    componentDidMount() {
       let input = document.getElementById('location');
       this.autocomplete = new google.maps.places.Autocomplete(input);
       axios({
         method:"post",
         url:"/retrieveplayerteams",
         data:{
           user:localStorage.getItem("user")
         }
       }).then((res)=>{
         this.setState({
           playerteams:res.data
         })
         console.log(this.playerteams);
       })
    }
    selectTeam(team){
      if(confirm("select "+team["name"]+"?")){
        this.setState({
          teamselected:team
        })
      }
    }

        teamDropDown(){
      if(this.ownedteams.length==0){
        return(<div>You have no teams</div>);
      }
      const teams=this.ownedteams.map((team)=>{
        return(
          <div className="team" key={"team:"+team["name"]}>
            <div>{team["name"]}</div>
            <button className = "btn btn-secondary"
              data-toggle="collapse"
              data-target="#selectTeam"
              onClick={()=>{this.selectTeam(team)}}>Select</button>
          </div>
        )
      })
      return teams;
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
        if(this.state.teamselected==null){
          alert("select a team");
          return;
        }
        let sport = this.refs.sport.value;
        let name = this.getName();
        let location = this.refs.location.value;
        let isprivate = this.state.isprivate;
        let team = this.state.teamselected;
        let coords = this.autocomplete.getPlace().geometry.location;
        let id = Math.floor((Math.random()*(1 << 30))+1);
        let game = {
            gameId: id,
            sport: sport,
            name: name,
            isprivate:isprivate,
            location: location,
            user: localStorage.getItem("user"),
            teams:[team.name],
            coords: {
                lat: coords.lat(),
                lng: coords.lng()
            },
        };
        console.log(game);
        axios({
          url:'/postgamesT',
          method:"post",
          data:{
            game:game
          }
          }).then( () =>
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
              <div className="form-group">
      <label className="cols-sm-2 control-label">Team Name</label>
      <div className="cols-sm-10">
        <div className="input-group">
          <span className="input-group-addon"></span>
            <input
            className='gameDetails form-control'
            type="text"
            ref="name"
            placeholder="Name"
            />
        </div>
      </div>
    </div>

            );
        }
    }
    teamSelected(){
      if(this.state.teamselected==null){
        return(<h3>No team selected</h3>)
      }
      else{
        return(<h3>{this.state.teamselected.name}</h3>)
      }
    }
    render(){
        this.ownedteams=this.state.playerteams.filter((team)=>{
          return(team["captain"]==this.props.user)
        })
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

                      {this.displayNameInput()}



                      <div className="form-group">
                        <button
                          data-toggle="collapse"
                            data-target="#selectTeam"
                     className='btn btn-primary'
                     >Select Team</button>

                   <div id="selectTeam" className="collapse">
                     <div>
                      {this.teamDropDown()}
                     </div>
                      </div>
                    </div>



                    <div className="form-group">
                      <div className="cols-sm-10">
                        <div className="input-group">
                          <div>
                            Team Selected:{this.teamSelected()}
                          </div>
                        </div>
                      </div>
                    </div>



                      <div className="form-group">
                        <label className="cols-sm-2 control-label">Activity</label>
                        <div className="cols-sm-10">
                          <div className="input-group">
                            <span className="input-group-addon"></span>
                            <input className='gameDetails form-control' type="text"
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
                            <input className='gameDetails form-control' type="text"
                              id= 'location'
                              ref="location"
                              placeholder="Location"/>
                          </div>
                        </div>
                      </div>


                      <div className="form-group">
                        <p>Private</p>
                        <input
                          className='gameDetails'
                          id= 'isprivate'
                         type="checkbox"
                         ref="isprivate"
                         onChange={this.togglePrivate}/>
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
            <GameTable user={this.props.user} ownedteams={this.ownedteams}/>
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
                return (<Game ownedteams={this.props.ownedteams} game = {game} user={this.props.user} key={game.id} />);
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
    this.showTeamGamesJoin=this.showTeamGamesJoin.bind(this);
    this.showTeamGamesLeave=this.showTeamGamesLeave.bind(this);
    this.state={
      showDropDownJoin:false,
      showDropDownLeave:false
    }
    this.ownedteams=[];
  }

  joinGame()
   {
     //axios.post('/joinT', {uid:this.props.user, gid:this.props.game.id});
     if(this.state.showDropDownJoin==false){
       this.setState({
       showDropDownJoin:true
       })
     }
     else{
       this.setState({
         showDropDownJoin:false
       })
     }
   }
   leaveGame(){
     //axios.patch('/gamesT', {uid:this.props.user, gid:this.props.game.id});
     if(this.state.showDropDownLeave==false){
       this.setState({
       showDropDownLeave:true
       })
     }
     else{
       this.setState({
         showDropDownLeave:false
       })
     }
   }


   showTeamGamesJoin(){
    if(this.state.showDropDownJoin==false){
      return;
    }
    if(this.props.ownedteams.length==0){
      return(<div>You have no teams</div>);
    }
    const teams=this.props.ownedteams.map((team)=>{
      return(
        <div className="team" key={"teamjoin:"+team["name"]}>
          <div>{team["name"]}</div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={()=>{this.selectTeamJoin(team)}}>Select</button>
        </div>
      )
    })
    return teams;
  }
  selectTeamJoin(team){
    if(confirm("join with "+team["name"]+"?")){
      axios({
        url:"/joinT",
        method:"patch",
        data:{
          team:team,
          game:this.props.game
        }
      })
    }
  }
  selectTeamLeave(team){
    if(confirm("leave with "+team["name"]+"?")){
      axios({
        url:"/leavegameT",
        method:"patch",
        data:{
          team:team,
          game:this.props.game
        }
      })
    }
  }
  showTeamGamesLeave(){
    if(this.state.showDropDownLeave==false){
      return;
    }
    if(this.props.ownedteams.length==0){
      return(<div>You have no teams</div>);
    }
    const teams=this.props.ownedteams.map((team)=>{
      return(
        <div className="team" key={"teamleave:"+team["name"]}>
          <div>{team["name"]}</div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={()=>{this.selectTeamLeave(team)}}>Select</button>
        </div>
      )
    })
    return teams;
  }

  render(){
    return(
      <tr>
       <td >{this.props.game.sport}</td>
       <td >{this.props.game.owner}</td>
       <td >{this.props.game.location}</td>
       <td>
         <button className="btn btn-success"
           onClick={this.joinGame.bind(this)}>Join</button>


         <div className="dropdown">
           {this.showTeamGamesJoin()}
         </div>


       </td>
       <td>
         <button className="btn btn-danger"
           onClick={this.leaveGame.bind(this)}>Leave</button>


         <div className="dropdown">
           {this.showTeamGamesLeave()}
         </div>


       </td>
       <td > {this.props.game.teams.length}</td>
       <td><Link to={"/tgame:"+this.props.game.id}>Details</Link></td>
     </tr>
    );
  }
}
module.exports={
  CurrentTeamGames
}
