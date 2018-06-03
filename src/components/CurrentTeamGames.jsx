import React from 'react';
import '../css/App.css';
import InputField from '../helpers/InputField';
var {Link}=require('react-router-dom');
import NavBar from "./NavBar"
import axios from 'axios';

const GUEST = "guest";

export class CurrentTeamGames extends React.Component{

    constructor(props) {
        super(props);
        console.log("params",this.props.match.params);
        this.search=this.props.match.params.search;
        if(this.search!=null){
          while(!(/[0-9]|[a-z]/i.test(this.search[0]))){
      			this.search=this.search.substring(1,this.search.length);
      		}
        }
        console.log("USER",this.props.user);
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
            user:this.props.user
          }
        }).then((res)=>{
          this.playerteams=res.data;
          console.log(this.playerteams);
        })
    }
    componentDidMount() {
       let input = document.getElementById('location');
       axios({
         method:"post",
         url:"/retrieveplayerteams",
         data:{
           user:this.props.user
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


    addGame(event) {
        event.preventDefault();
        if(this.state.teamselected==null){
          alert("Select a team");
          return;
        }
        let team = this.state.teamselected;
        let id = Math.floor((Math.random()*(1 << 30))+1);
        let game = {
            gameId: id,
            sport: this.refs.sport.getInput(),
            name: this.props.user,
            isprivate:this.state.isprivate,
            location: this.refs.location.getInput(),
            user: this.props.user,
            teams:[team._id],
        };
        if (this.gameIsValid(game) == true)
        {
            $('#createTeamGames').collapse('hide');
            console.log(game);
            axios({
              url:'/postgamesT',
              method:"post",
              data:{
                game:game
              }
              }).then( () =>
                    {alert("Game added. It will appear upon refreshing the games table")});
            this.refs.sport.clear();
            this.refs.name.clear();
            this.refs.location.clear();
        }
        else
        {
            this.displayInputErrors(game);
        }
    }
    gameIsValid(game)
    {
        let isValid = true;
        if (game.sport.trim() == "")
        {
            isValid = false;
        }
        if ( isNaN(game.gameLength) || game.gameLength < 0 )
        {
            isValid = false;
        }
        if (game.location.trim() == "")
        {
            isValid = false;
        }
        return isValid;
    }
    displayInputErrors(game)
    {
        if (game.sport.trim() == "")
        {
            this.refs.sport.setError("Please give a non-empty name");
        }
        if (game.location.trim() == "")
        {
            this.refs.location.setError("Please give a non-empty location");
        }
        if ( isNaN(game.gameLength) || game.gameLength < 0 )
        {
            this.refs.gameLength.setError("Please input a non-negative number");
        }
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
                <NavBar user={this.props.user}/>



                  <div className="container">
                    <button type="button" className="btn btn-primary" data-toggle="collapse"
                      data-target="#createTeamGames">Create A Team Game</button>


                    <div id="createTeamGames" className="collapse">
                        <div className="row main">


                          <div className="panel-heading">
                           <div className="panel-title text-center">
                              <h1 className="collapseTitle">Create a team game below:</h1>
                              <hr />
                            </div>
                        </div>





                        <div className="main-create main-center">

                          <div>
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

                    <form className="form-horizontal"
                      onSubmit={this.addGame.bind(this)}>


                    <div className="form-group">
                      <div className="cols-sm-10">
                        <div className="input-group">
                          <div>
                            Team Selected:{this.teamSelected()}
                          </div>
                        </div>
                      </div>
                    </div>



                      <InputField label="Activity" type="text" ref="sport"
                            placeholder="Activity" />
                      <InputField label="City" type="text" id="location"
                            ref="location" placeholder="Location" />

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
            <GameTable user={this.props.user} ownedteams={this.ownedteams} defaultSearch={this.search}/>
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
      allGames:[],
  	  filteredGames: [],
      userTeams:[],
      retrieving: false,
      defaultSearch:null,
  	}
    this.userTeams=this.userTeams.bind(this);
    if(this.props.defaultSearch!=null){
      this.state.defaultSearch=this.props.defaultSearch;
    }
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
            (game.location.toLowerCase().indexOf(search.toLowerCase()) !== -1))||
            (String(game.id).indexOf(String(search))!==-1);
            })
        });
    }
    updateTableAll(search){
      this.setState({filteredGames : this.state.allGames.filter(
          (game) => { return(String(game.id).indexOf(String(search))!==-1)

          })
      });
  }

  retrieveGames() {
      this.setState({retrieving: true});
      axios.post('/retrievegamesT').then((results)=>{
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
    this.joinButton=this.joinButton.bind(this);
    this.leaveButton=this.leaveButton.bind(this);
    this.ownedteams=[];
  }

   showTeamGamesJoin(){
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
    console.log("joining with team")
    if(confirm("join with "+team["name"]+"?")){
      axios({
        url:"/joinT",
        method:"post",
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
        method:"post",
        data:{
          team:team,
          game:this.props.game
        }
      })
    }
  }
  showTeamGamesLeave(){
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

  joinButton(){
  return(
    <div>
  <button className="btn btn-success"
    data-toggle="collapse"
     data-target={"#join"+this.props.game.id}>Join</button>


   <div id={"join"+this.props.game.id} className="collapse">
    {this.showTeamGamesJoin()}
  </div>
  </div>
);
}

  leaveButton(){
    return(
      <div>
    <button className="btn btn-danger"
      data-toggle="collapse"
       data-target={"#leave"+this.props.game.id}>Leave</button>


     <div id={"leave"+this.props.game.id} className="collapse">
      {this.showTeamGamesLeave()}
    </div>
    </div>
  );
  }

  render(){
    return(
      <tr>
       <td >{this.props.game.sport}</td>
       <td >{this.props.game.owner}</td>
       <td >{this.props.game.location}</td>
       <td>


         {this.joinButton()}


       </td>
       <td>
         {this.leaveButton()}

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
