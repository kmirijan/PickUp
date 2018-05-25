import React from 'react';
import '../css/App.css';
import NavBar from "./NavBar"
var {Link}=require('react-router-dom');


import axios from 'axios';

const GUEST = "guest";


class TeamPage extends React.Component{


    render(){
        return(
            <div>
                <NavBar/>
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
        let sport = this.refs.sport.value;
        let name = this.refs.name.value;
        let city = this.refs.city.value;
        let maxPlayers = parseInt( this.refs.maxPlayers.value, 10 );
        let team = {
            sport: sport,
            name: name,
            city: city,
            captain: this.props.user,
            maxPlayers: maxPlayers
        };
        axios.post('/postteam', team);
        this.refs.sport.value='';
        this.refs.name.value='';
        this.refs.city.value='';
        this.refs.maxPlayers.value='';
    }


    displayNameInput()
    {
            return (
                <input
                className='teamDetails form-control'
                type="text"
                ref="name"
                placeholder="Name"
                />

            );
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
                      <h1 className="title">Create a team below:</h1>
                      <hr />
                    </div>
                </div>
                <div className="main-create main-center">
            <form className="form-horizontal"
              onSubmit={this.addTeam.bind(this)}>
                        <div className="form-group">
                <label className="cols-sm-2 control-label">Team Name</label>
                <div className="cols-sm-10">
                  <div className="input-group">
                    <span className="input-group-addon"></span>
                                    {this.displayNameInput()}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="cols-sm-2 control-label">Activity</label>
                <div className="cols-sm-10">
                  <div className="input-group">
                    <span className="input-group-addon"></span>
                    <input className='teamDetails form-control' type="text"
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
                    <input className='teamDetails form-control' type="text"
                      id= 'city'
                      ref="city"
                      placeholder="City"/>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="cols-sm-2 control-label">Max # Players</label>
                <div className="cols-sm-10">
                  <div className="input-group">
                    <span className="input-group-addon"></span>
                    <input className='teamDetails form-control' type="text"
                      id='maxPlayers'
                      ref="maxPlayers"
                      placeholder="Max # Players"/>
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
                return (<TeamRow team = {team} user={this.props.user} key={team.name}/>);
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
    axios.post('/jointeam', {user:this.props.user, teamName:this.props.team.name});
  }
  leaveTeam(){
    axios.patch('/team', {user:this.props.user, teamName:this.props.team.name});
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
          <td>{this.props.team.members.length}/{this.props.team.members.maxPlayers}</td>
          <td><Link to={"/team:"+this.props.team.name}>Details</Link></td>
        </tr>
    );
  }
}

module.exports={
    TeamPage
}
