var React=require('react');
var ReactDOM=require('react-dom');
require('../css/profiles.css');
var {Switch,BrowserRouter,Route,browserHistory,Redirect}=require('react-router-dom');
var axios=require('axios');
var {Link}=require('react-router-dom');

//constants
const SINGLE=0;


class ProfileP extends React.Component{
	constructor(props){
		super(props);

		//check whether user is passed down correctly
		console.log('USER',this.props.user);

		//function bindings
		this.expandBio=this.expandBio.bind(this);
		this.edit=this.edit.bind(this);
		this.processFeed=this.processFeed.bind(this);
		this.acceptFriendreq=this.acceptFriendreq.bind(this);
		this.declineFriendreq=this.declineFriendreq.bind(this);

		//rids username of semicolons/equal signs
    var usrnm=this.props.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}

		//default states
		this.state={
			expname:'Expand',
			expanded:false,
			pic:'',
			short:'',
			long:'',
			username:usrnm,
			alias:'',
			email:'',
			games:[],
			friends:[],
			feed:[],
      myGames:[],
			myTeamGames:[],
			myTeams:[]
		}
	}

	//directs to edit page
	edit(){
		this.props.history.push('/edit:'+this.props.username);
	}

	//expands and reduces bio
	expandBio(){
		if(this.state.expanded==false){
			this.setState({expanded:true});
			this.setState({expname:'Collapse'});
		}
		else{
			this.setState({expanded:false});
			this.setState({expname:'Expand'});
		}
	}

	/*bio expansion*/
	componentDidUpdate(prevProps,prevState){
		if(this.state.expanded==true && this.state.expanded!=prevState.expanded)
			this.refs.bio.innerHTML=this.state.long;
		if(this.state.expanded==false && this.state.expanded!=prevState.expanded)
			this.refs.bio.innerHTML=this.state.short;

	}

	componentDidMount(){
		//get user data from username collection
		axios.post('/user',{
				user:this.state.username
		}).then((res)=>{
			var userStates=res.data[SINGLE];
			console.log('user states',res.data[SINGLE])
			this.setState({
				username:userStates['username'],
				pic:userStates['pic'],
				alias:userStates['alias'],
				long:userStates['bio'],
				short:userStates['bio'],
				email:userStates['email'],
				games:userStates['games'],
				teamGames:userStates['teamgames'],
				teams:userStates['teams'],
				friends:userStates['friends'],
				feed:userStates['feed'],
			});
			//make bio shorter if it's too long
    	if(this.state.long.length>100){
    		this.setState({short:this.state.long.substring(0,100)});
    	}

			//catches error from post to /user
		}).catch((error)=>{
         	console.log(error.response.data);
      	});
	}

  componentWillMount(){
		/*retrieves user's games, team games, and teams, respectively*/
    axios.post('/usergames', {user:this.state.username}).then( (results) => {
        this.setState({myGames : results.data});
    });
		axios.post("/usergamest",{user:this.props.username}).then((results)=>{
			this.setState({myTeamGames:results.data});
		})
		axios.post("/retrieveplayerteams",{user:this.props.username}).then((results)=>{
			this.setState({myTeams:results.data});
		})
  }

	//creates friends list
  friendsList(){
		if(this.state.friends==undefined){return}
		var friends=this.state.friends.filter(
			friend=>friend['req']=='accepted'
		);
		friends=friends.map((f)=>
			<li className='list-group-item' key={f['username']}>{f['username']}</li>
		)
		return(
			<ul className='list-group' key='friends'>{friends}</ul>
		)
	}

	//handles accept friend request
	acceptFriendreq(friend){
		this.refs.friendaccept.setAttribute('disabled','disabled');
		axios({
			method:'post',
			url:'/acceptfriend',
			data:{
				'user':this.props.user,
				'friend':friend,
			}
		}).then((res)=>{
			this.setState(res.data);
			this.refs.friendaccept.removeAttribute('disabled');
		})
	}

	//handles decline friend request
	declineFriendreq(friend){
		this.refs.frienddecline.setAttribute('disabled','disabled');
		axios({
			method:'post',
			url:'/declinefriend',
			data:{
				'user':this.props.user,
				'friend':friend,
			}
		}).then((res)=>{
			this.setState(res.data);
			this.refs.frienddecline.removeAttribute('disabled');
		})
	}

	/*processes feed by the type of messages received
	The only type available in this project is friend requests*/
	processFeed(f){
		if(f['type']=='friendreq'){
			return(
				<div>
					<p>
						{f['sender']} Sent you a friend request!
					</p>
					<button
						ref='friendaccept'
						className='btn btn-success'
						onClick={()=>this.acceptFriendreq(f['sender'])}>
						Accept
					</button>
					<button
						ref='frienddecline'
						className='btn btn-danger'
						onClick={()=>this.declineFriendreq(f['sender'])}>
						Decline
					</button>
				</div>
			)
		}
		else{return}
	}

	/*creates feed*/
	feed(){
		if(this.state.feed==undefined){return}
		const feed=this.state.feed.map((f)=>
			<li className='list-group-item' key={f['type']}>{this.processFeed(f)}</li>
		)
		return(
			<ul className='list-group' key='feed'>{feed}</ul>
		)
	}

	render(){
		/*profile picture dimensions*/
		const picStyle={
			'maxWidth':'200px',
			'maxHeight':'200px'
		}

		return(
			<div id='profile'>

				<div className='container'>

					<img src='/feed.jpg' className='centerPic'/>
					<div className='text-block'>
						<div id='picture'>
							<img src={this.state.pic} style={picStyle}></img>
							<div id='mask'></div>
							<p id='changeimg'>change picture</p>
						</div>
					</div>

					<div id='alias'>
						<div>
							{this.state.alias}
						</div>
					</div>

				</div>

				<div className='container'>
					<div id='panel'>
						<div id = 'card'>
							<div className='infoHeader'>Info:</div>
							<div id='username'>
								{this.state.username}
							</div>

							<div id='email'>
								{this.state.email}
							</div>

							<div id='bio' ref='bio'>
								{this.state.short}
							</div>

							<div id='edit'>
								<button className='btn btn-default btn-md' onClick={this.edit}>
									Edit
								</button>
								<button className ='btn btn-default btn-md' onClick={this.expandBio}>
									{this.state.expname}
								</button>
							</div>
						</div>


						<div className='w3-card'>
							<GamesList
							 	games={this.state.myGames}
								teamgames={this.state.myTeamGames}
								teams={this.state.myTeams}
								user={this.props.user}
							/>
							<div id='gamesText'>
								Friends:<br></br>
								{this.friendsList()}
							</div>
						</div>
					</div>

					<div id='fpanel'>
						<div id='feed'>
							{this.feed()}
						</div>
					</div>
				</div>
			</div>
			);
	}
}

class GamesList extends React.Component
{
		constructor(props){
			super(props);
			//function binding
			this.deleteGame=this.deleteGame.bind(this);
			this.displayGame=this.displayGame.bind(this);
			this.state={
				deleteGameClicked:false
			}
		}

		deleteGame(gameId, players){
			if(this.state.deleteGameClicked==false){
				if(confirm('delete game?')){
					axios({
						method:'delete',
						url:'/games',
						data:{
							gid:gameId,
							players:players
						}
					})
					.then(()=>{
						console.log('game deleted');
						this.setState({
							deleteGameClicked:true
						})
					})
				}
			}
		}

		deleteTeamGame(gameId, teams){
			if(confirm('delete team game?')){
				axios({
					method:'post',
					url:'/deleteGameT',
					data:{
						gameId:gameId,
						teams:teams
					}
				})
				.then(()=>{
					console.log('team game deleted');

				})
			}
		}


		deleteTeam(teamId,teamMembers){
			if(confirm('delete team?')){
				axios({
					method:'post',
					url:'/deleteteam',
					data:{
						teamId:teamId,
						teamMembers:teamMembers
					}
				})
				.then(()=>{
					console.log('team deleted');

				})
			}
		}

		componentDidUpdate(){
			if(this.state.deleteGameClicked==true){
				axios.post('/usergames', {user:this.props.user}).then( (results) => {
						this.setState({games : results.data});
				})
				this.setState({deleteGameClicked:false});
			}
		}

		componentWillMount(){
		}

		componentWillReceiveProps(newprops){
			this.forceUpdate();
		}
    displayGame(game)
    {
        return (
					<tr key={game.id}>
						<td >{game.sport}</td>
						<td >{game.name}</td>
						<td >{game.location}</td>
						<td><Link to={'/map:'+game.id}>Link</Link></td>
					</tr>
        )
    }
		displayGamesMade(game){
			return (
				<tr key={game.id}>
					<td >{game.sport}</td>
					<td >{game.name}</td>
					<td >{game.location}</td>
					<td><Link to={'/map:'+game.id}>Link</Link></td>
					<td><button className='btn btn-danger'
						onClick={()=>{this.deleteGame(game.id,game.players)}}>
						Delete
					</button></td>
				</tr>
			)
		}
		displayTeamGame(game)
    {
        return (
					<tr key={game.id}>
						<td >{game.sport}</td>
						<td >{game.name}</td>
						<td >{game.location}</td>
						<td><Link to={'/teamgames:'+game.id}>Link</Link></td>
					</tr>
        )
    }
		displayTeamGamesMade(game){
			return (
				<tr key={game.id}>
					<td >{game.sport}</td>
					<td >{game.name}</td>
					<td >{game.location}</td>
					<td><Link to={'/teamgames:'+game.id}>Link</Link></td>
					<td><button className='btn btn-danger'
						onClick={()=>{this.deleteTeamGame(game.id,game.teams)}}>
						Delete
					</button></td>
				</tr>
			)
		}
		displayTeam(team)
    {
        return (
					<tr key={team.id}>
						<td >{team.sport}</td>
						<td >{team.name}</td>
						<td >{team.location}</td>
						<td><Link to={'/teams:'+team._id}>Link</Link></td>
					</tr>
        )
    }
		displayTeamsMade(team){
			return (
				<tr key={team.id}>
					<td >{team.sport}</td>
					<td >{team.name}</td>
					<td >{team.location}</td>
					<td><Link to={'/teams:'+team.id}>Link</Link></td>
					<td><button className='btn btn-danger'
						onClick={()=>{this.deleteTeam(team._id,team.members)}}>
						Delete
					</button></td>
				</tr>
			)
		}
    render()
    {
			//games
			if (this.props.games==[]) return;
			var gamesList = this.props.games.filter((game)=>{
				{return game['owner']!=this.props.user}
			})
			gamesList = gamesList.map((game) =>
					{return this.displayGame(game)}
			);
			var gamesMade = this.props.games.filter((game)=>{
				{return game['owner']==this.props.user}
			})
			gamesMade = gamesMade.map((game) =>
					{return this.displayGamesMade(game)}
			);

			//teamgames
			if (this.props.teamgames==[]) return;
			var teamGamesList = this.props.teamgames.filter((game)=>{
				{return game['owner']!=this.props.user}
			})
			teamGamesList = teamGamesList.map((game) =>
					{return this.displayTeamGame(game)}
			);
			var teamGamesMade = this.props.teamgames.filter((game)=>{
				{return game['owner']==this.props.user}
			})
			teamGamesMade = teamGamesMade.map((game) =>
					{return this.displayTeamGamesMade(game)}
			);

			//teams
			if (this.props.teams==[]) return;
			var teamsList = this.props.teams.filter((game)=>{
				{return game['captain']!=this.props.user}
			})
			teamsList = teamsList.map((game) =>
					{return this.displayTeam(game)}
			);
			var teamsMade = this.props.teams.filter((game)=>{
				{return game['captain']==this.props.user}
			})
			teamsMade = teamsMade.map((game) =>
					{return this.displayTeamsMade(game)}
			);
      return(
				<div>
					<h2 id='gamesText'>Games Played</h2>
					<table><tbody key='gamesList'>{gamesList}</tbody></table>
					<h2 id='gamesText'>Games Made</h2>
					<table><tbody key='gamesMadeList'>{gamesMade}</tbody></table>
					<h2 id='gamesText'>Team Games Played</h2>
					<table><tbody key='teamGamesList'>{teamGamesList}</tbody></table>
					<h2 id='gamesText'>Team Games Made</h2>
					<table><tbody key='teamGamesMadeList'>{teamGamesMade}</tbody></table>
					<h2 id='gamesText'>Teams Joined</h2>
					<table><tbody key='teamsList'>{teamsList}</tbody></table>
					<h2 id='gamesText'>Teams Made</h2>
					<table><tbody key='teamsMadeList'>{teamsMade}</tbody></table>
				</div>
	    );
    }

}


module.exports={
	ProfileP
}
