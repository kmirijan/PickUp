import React from 'react';
import '../css/App.css';
import NavBar from "./NavBar"
var {Link}=require('react-router-dom');


import axios from 'axios';

const GUEST = "guest";


class TeamPage extends React.Component{



    componentDidMount() {
        console.log("rendered")
    }


    render(){
        return(
            <div>
                <NavBar/>
                <TeamCreate user={this.props.user}
                <TeamTable user={this.props.user} />
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
    <th>Leave</th>
    <th>Players</th>
    <th></th>
	</tr>
      </thead>
      <tbody>
	      {
            this.state.filteredTeams.map((team)=>{
                return (<TeamRow team = {team} user={this.props.user}/>);
            })
         }
	  </tbody>
      </table>
      </div>
	);

  }

}

export class Team extends React.Component {

  joinTeam()
  {
    axios.post('/jointeam', {uid:this.props.user, tid:this.props.team.name});
  }
  leaveGame(){
    axios.patch('/team', {uid:this.props.user, tid:this.props.team.name});
  }


  render(){
    return(
        <tr>
          <td>{this.props.team.name}</td>
          <td>{this.props.team.sport}</td>
          <td>{this.props.team.city}</td>
          <td>{this.props.team.captain}</td>
          <td><input  type="button"
            className="btn btn-success btn-md"
            onClick={this.joinTeam.bind(this)} value="Join"/></td>
          <td><input type="button"
            className="btn btn-danger btn-md"
            onClick={this.leaveTeam.bind(this)} value="Leave"/></td>
          <td>{this.props.team.members.length}</td>
          <td><Link to={"/team:"+this.props.team.name}>Details</Link></td>
        </tr>
    );
  }
}

module.exports={
    TeamPage
}
