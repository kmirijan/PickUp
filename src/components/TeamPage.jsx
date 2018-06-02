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
  console.log("USER",this.props.user);
}
    render(){
        return(
            <div>
                <NavBar user={this.props.user}/>
                <TeamCreate user={this.props.user }/>
                <TeamTable user={this.props.user} />
            </div>
        );

    }
}
class TeamCreate extends React.Component{



    constructor(props) {
        super(props);
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
        if (this.teamValidate == true)
        {
            $('#createTeams').collapse('hide');
            axios.post('/postteam', team);
            this.refs.sport.clear();
            this.refs.name.clear();
            this.refs.city.clear();
            this.refs.maxPlayers.clear();
        }
        else
        {
            this.displayInputErrors();
        }
    }
    teamValidate(team)
    {
        let isValid = true;
        if (team.name.trim() == "")
        {
            isValid = false;
        }
        if (team.city.trim() == "")
        {
            isValid = false;
        }
        if (team.sport.trim() == "")
        {
            isValid = false;
        }
        if ( isNaN(team.maxPlayers) || team.maxPlayers < 1 )
        {
            isValid = false;
        }
        return isValid;
    }
    displayInputErrors(team)
    {
        if (team.sport.trim() == "")
        {
            this.refs.sport.setError("Please give a non-empty value");
        }
        if (team.city.trim() == "")
        {
            this.refs.city.setError("Please give a non-empty value");
        }
        if (team.name.trim() == "")
        {
            this.refs.name.setError("Please give a non-empty value");
        }
        if ( isNaN(team.maxPlayers) || game.gameLength < 1 )
        {
            this.refs.gameLength.setError("Please input a positive number");
        }
    }

    render(){

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
              <InputField label="City" type="text" ref="location" id="location"
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

 constructor(props)
  {
    super(props);
	this.state =
	{
      teams: [],
	  filteredTeams: [],
      retrieving: false,
	}
  }

  componentDidMount()
  {
    this.retrieveTeams();
  }


    updateSearch(event){
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

    retrieveTeams() {
        this.setState({retrieving: true});
        axios.post('/retrieveteams').then((results)=>{
            this.setState({teams: results.data, retrieving: false});
            this.updateTable(this.refs.search.value);


        });


    }


  render() {
    if (this.state.retrieving == true)
    {
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

  joinTeam()
  {
    axios.post('/jointeam', {user:this.props.user, teamId:this.props.team._id});
  }
  leaveTeam(){
    axios.patch('/team', {user:this.props.user, teamId:this.props.team._id});
  }

  getJoinLeaveButton()
  {

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
