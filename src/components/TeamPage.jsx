import React from 'react';
import '../css/App.css';
import InputField from '../helpers/InputField';
import NavBar from "./NavBar"
var {Link}=require('react-router-dom');


import axios from 'axios';

const MAX_TEAM_SIZE = 20;

class TeamPage extends React.Component{
  constructor(props){
    super(props);
    console.log("params",this.props.match.params);
    this.search=this.props.match.params.search;
    if(this.search!=null){
      while(!(/[0-9]|[a-z]/i.test(this.search[0]))){
        this.search=this.search.substring(1,this.search.length);
      }
    }
    console.log("USER",this.props.user);
  }

  reloadTable() {
      this.refs.table.reload();
  }

  render(){
      return(
          <div>
              <NavBar user={this.props.user}/>
              <TeamCreate onNewTeam={this.reloadTable.bind(this)} user={this.props.user }/>
              <TeamTable ref="table" user={this.props.user} defaultSearch={this.search}/>
          </div>
      );
  }
}
class TeamCreate extends React.Component{

  constructor(props) {
    super(props);
  }

  getName() {
    if (this.props.user != GUEST) {
      return this.props.user;
    }
    else {
      return this.refs.name.value;
    }
  }

  addTeam(event) {
    event.preventDefault();
    let sport = this.refs.sport.getInput();
    let name = this.refs.name.getInput();
    let city = this.refs.city.getInput();
    let maxPlayers = parseInt(this.refs.maxPlayers.getInput());
    let team = {
      sport: sport,
      name: name,
      city: city,
      captain: this.props.user,
      maxPlayers: maxPlayers
    };
    if (this.teamValidate(team) == true) {
      $('#createTeams').collapse('hide');
      axios.post('maketeam', team);
      axios.patch('maketeam', {uid: this.props.user, tid: team.name}).then(this.props.onNewTeam);
      this.refs.sport.clear();
      this.refs.name.clear();
      this.refs.city.clear();
      this.refs.maxPlayers.clear();
    }
    else {
      this.displayInputErrors(team);
    }
  }
  teamValidate(team) {
    let isValid = true;
    if (team.name.trim() == "") {
      isValid = false;
    }
    if (team.city.trim() == "") {
      isValid = false;
    }
    if (team.sport.trim() == "") {
      isValid = false;
    }
    if ( isNaN(team.maxPlayers) || team.maxPlayers < 1 ) {
      isValid = false;
    }
    return isValid;
  }
  displayInputErrors(team) {
    if (team.sport.trim() == "") {
      this.refs.sport.setError("Please give a non-empty value");
    }
    if (team.city.trim() == "") {
      this.refs.city.setError("Please give a non-empty value");
    }
    if (team.name.trim() == "") {
      this.refs.name.setError("Please give a non-empty value");
    }
    if ( isNaN(team.maxPlayers) || game.gameLength < 1 ) {
      this.refs.gameLength.setError("Please input a positive number");
    }
  }

  render() {

      return(
        <div className="container">
          <button type="button" className="btn btn-primary" data-toggle="collapse"
            data-target="#createTeams">Create A Team</button>


          <div id="createTeams" className="collapse">
              <div className="row main">
                <div className="panel-heading">
                 <div className="panel-title text-center">
                    <h1 className="collapseTitle">Create a team below:</h1>
                    <hr />
                  </div>
              </div>
              <div className="main-create main-center">
          <form className="form-horizontal"
            onSubmit={this.addTeam.bind(this)}>

            <InputField label="Team Name" type="text" ref="name"
                  placeholder="Team Name" />
            <InputField label="Activity" type="text" ref="sport"
                  placeholder="Activity" />
            <InputField label="City" type="text" ref="city" id="location"
                  placeholder="Location" />
            <InputField label="Max # Players" type="number" ref="maxPlayers"
                  placeholder="Max # Players" min="0" max={MAX_TEAM_SIZE} />

            <div className="form-group">

            <div>
              <input type="submit" className="btn btn-primary"
                  value="Create"/>
              <span></span>
              <input type="reset" className="btn btn-default" value="Clear"/>
            </div>
            </div>
          </form>
        </div>
      </div>

      </div>
      </div>
      );
  }
}
class TeamTable extends React.Component {

  constructor(props) {
    super(props);
    this.state =
  	{
      teams: [],
  	  filteredTeams: [],
      retrieving: false,
      defaultSearch:null,
  	}

    if(this.props.defaultSearch!=null){
      this.state.defaultSearch=this.props.defaultSearch;
    }
  }

  componentDidMount() {
    this.retrieveTeams();
  }


  updateSearch(event) {
    this.updateTable(event.target.value);
  }

  updateTable(search) {
    this.setState({filteredTeams : this.state.teams.filter(
        (team) => { return ((team.sport.toLowerCase().indexOf(search.toLowerCase()) !== -1)||
        (team.name.toLowerCase().indexOf(search.toLowerCase())!== -1)||
        (team.city.toLowerCase().indexOf(search.toLowerCase()) !== -1));
        })
    });
  }
  updateTableAll(search){
    this.setState({filteredTeams : this.state.teams.filter(
      (team) => { return(String(team._id).indexOf(String(search))!==-1)})
    });
  }

  retrieveTeams() {
    this.setState({retrieving: true});
    axios.post('/retrieveteams').then((results)=>{
        this.setState({teams: results.data, retrieving: false});
        if(this.state.defaultSearch==null){
          this.updateTable(this.refs.search.value);
        }
        else{
          this.updateTableAll(this.state.defaultSearch);
          this.setState({defaultSearch:null});
        }
    });
  }

  reload() {
      this.retrieveTeams();
  }

  render() {
    if (this.state.retrieving == true) {
        return (<h2 className="retrieving">Retrieving Teams...</h2>);
    }
    else return (
      <div>
        <div className="searchBox">
          <input className="form-control" type="text"
            placeholder="Search"
		          ref="search"
        onChange={this.updateSearch.bind(this)}/>

        <input className = "btn btn-primary" type="button" value="Refresh"
          onClick={this.retrieveTeams.bind(this)}
          style={{margin:"auto"}}/>
    </div>

	   <table className="table table-bordered table-hover">
	   <thead>
       <tr>
	  <th>Team</th>
      <th>Sport</th>
	  <th>City</th>
      <th>Captain</th>
	  <th>Join</th>
    <th>Players</th>
    <th></th>
	</tr>
      </thead>
      <tbody>
	      {
            this.state.filteredTeams.map((team)=>{
                return (<TeamRow team = {team} user={this.props.user} key={team._id}/>);
            })
         }
	  </tbody>
      </table>
      </div>
	   );
  }
}

export class TeamRow extends React.Component {

  joinTeam() {
    axios.patch('/maketeam', {uid: this.props.user, tid: this.props.team.name});
    axios.patch('/team:user', {user:this.props.user, teamId:this.props.team._id});
  }
  leaveTeam(){
    axios.patch('/remove:team', {user:this.props.user, teamId:this.props.team._id});
  }

  getJoinLeaveButton() {
    if (this.props.team.members.includes(this.props.user)) {
      return (
        <input type="button"
            className="btn btn-danger btn-md"
            onClick={this.leaveTeam.bind(this)} value="Leave"/>
      );
    }
    else if (this.props.team.members.length >= this.props.team.maxPlayers) {
      return (<div className="fullTeam">FULL</div>);
    }
    else {
      return (
        <input  type="button"
            className="btn btn-success btn-md"
            onClick={this.joinTeam.bind(this)} value="Join"/>
      );
    }
  }

  render(){
    return(
        <tr>
          <td>{this.props.team.name}</td>
          <td>{this.props.team.sport}</td>
          <td>{this.props.team.city}</td>
          <td>{this.props.team.captain}</td>
          <td>{this.getJoinLeaveButton()}</td>
          <td>{this.props.team.members.length}/{this.props.team.maxPlayers}</td>
          <td><Link to={"/team:"+this.props.team._id}>Details</Link></td>
        </tr>
    );
  }
}

module.exports={
    TeamPage
}
