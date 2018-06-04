var React=require("react");
var ReactDOM=require("react-dom");
require("../css/profiles.css");
var axios=require("axios");
var {Link}=require('react-router-dom');


class Profile extends React.Component{
	constructor(props){
		super(props);
		console.log("USER",this.props.user);
		this.expandBio=this.expandBio.bind(this);
		this.addFriend=this.addFriend.bind(this);


        var usrnm=this.props.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}

		this.state={
			expname:"Expand",
			frname:"",
			expanded:false,
			pic:"",
			short:"",
			long:"",
			username:usrnm,
			alias:"",
			email:"",
			games:[],
			friends:[],
			feed:[],
      myGames:[],
			myTeamGames:[],
			myTeams:[],
		}
	}
	expandBio(){
		if(this.state.expanded==false){
			this.setState({expanded:true});
			this.setState({expname:"Collapse"});
		}
		else{
			this.setState({expanded:false});
			this.setState({expname:"Expand"});
		}
	}
	addFriend(){
		if(this.state.frname=="Pending Request"||this.state.frname=="Friends"){
			alert("you already sent a friend request");
		}
		else{
			/*https://stackoverflow.com/questions/35315872/reactjs-prevent-multiple-times-
			button-press?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa*/
			this.refs.addfriend.setAttribute("disabled","disabled");
			axios({
				method:"post",
				url:"/reqfriend",
				data:{
					"user":this.props.user,
					"friend":this.state.username,
				}
			}).then(()=>{
				this.setState({frname:"Pending Request"});
				this.refs.addfriend.removeAttribute("disabled");
			})
		}
	}

	componentDidMount(){
		console.log(this.state.username);
		axios.post("/user",{
				user:this.state.username
		}).then((res)=>{
			var userStates=res.data[0];
			this.setState({
				username:userStates["username"],
				pic:userStates["pic"],
				alias:userStates["alias"],
				long:userStates["bio"],
				short:userStates["bio"],
				email:userStates["email"],
				games:userStates["games"],
				teamGames:userStates["teamgames"],
				teams:userStates["teams"],
				friends:userStates["friends"],
				feed:userStates["feed"]
			});
			//make bio shorter
	      	if(this.state.long.length>100){
	      		this.setState({short:this.state.long.substring(0,100)});
	      	}
	      	//if not friend, frname = add friend
	      	//if is friend, frname = friends
	      	//if pending friend req, frname = pending req
	      	axios({
	      		method:"post",
	      		url:"/isfriend",
	      		data:{
	      			"user":this.props.user,
	      			"friend":this.state.username
	      		}
	      	}).then((res)=>{
	      		if(res.data=="pending"){
	      			this.setState({frname:"Pending Request"});
	      		}
	      		else if(res.data=="accepted"){
	      			this.setState({frname:"Friends"});
	      		}
	      		else{
	      			this.setState({frname:"Add Friend"});
	      		}
	      	})

		}).catch((error)=>{
         	console.log(error.response.data);
      	});

	}


    componentWillMount() {
        axios.post("/usergames", {user:this.props.username}).then( (results) => {
            this.setState({myGames : results.data});
        });
				axios.post("/usergamest",{user:this.props.username}).then((results)=>{
					this.setState({myTeamGames:results.data});
				})
				axios.post("/retrieveplayerteams",{user:this.props.username}).then((results)=>{
					this.setState({myTeams:results.data});
				})
    }

	gamesList(){
		if(this.state.games==undefined){return}
		const gamesList=this.state.games.map((games)=>
			<li  className="list-group-item" key={games["game"]}>{games["game"]}</li>
		)
		return(
			<ul className="list-group" key="gamesList">
			{gamesList}
			</ul>
		)
	}
	teamGamesList(){
		if(this.state.teamGames==undefined){return}
		const teamGamesList=this.state.teamGames.map((teamGames)=>
			<li  className="list-group-item" key={teamGames["game"]}>{teamGames["game"]}</li>
		)
		return(
			<ul className="list-group" key="teamGamesList">
			{teamGamesList}
			</ul>
		)
	}
	teamsList(){
		if(this.state.teams==undefined){return}
		const teamsList=this.state.teams.map((teams)=>
			<li  className="list-group-item" key={teams["game"]}>{teams["game"]}</li>
		)
		return(
			<ul className="list-group" key="gamesList">
			{teamsList}
			</ul>
		)
	}

	friendsList(){
		if(this.state.friends==undefined){return}
		var friends=this.state.friends.filter(
			friend=>friend["req"]=="accepted"
		);
		friends=friends.map((f)=>
			<li className="list-group-item" key={f["username"]}>{f["username"]}</li>
		)
		return(
			<ul className="list-group" key="friends">
  {friends}
</ul>
		)
	}
	feed(){
		if(this.state.feed==undefined){return}
		const feed=this.state.feed.map((f)=>
			<li  className="list-group-item" key={f["type"]}>{f["type"]}</li>
		)
		return(
			<ul className="list-group" key="feed">
  {feed}
</ul>
		)
	}
	componentDidUpdate(prevProps,prevState){
		if(this.state.expanded==true && this.state.expanded!=prevState.expanded)
			this.refs.bio.innerHTML=this.state.long;
		if(this.state.expanded==false && this.state.expanded!=prevState.expanded)
			this.refs.bio.innerHTML=this.state.short;

	}
	render(){
		const picStyle={
			"maxWidth":"200px",
			"maxHeight":"200px"
		}
		return(
			<div id="profile">
				<div className="container">
					<img src="/feed.jpg" className="centerPic"/>
						<div className="text-block">

							<div id="picture">
								<img src={this.state.pic} style={picStyle}></img>
								<div id="mask"></div>
								<p id="changeimg">change picture</p>
							</div>

						</div>

						<div id="alias">
							<div>
								{this.state.alias}
							</div>
						</div>
				</div>

				<div className="container">
					<div id="panel">

						<div id = "card">
							<div className="infoHeader">Info:</div>
							<div id="username">
								{this.state.username}
							</div>

							<div id="email">
								{this.state.email}
							</div>

							<div id="bio" ref="bio">
								{this.state.short}
							</div>
							<div id="edit">
								<button className="btn btn-default btn-md" onClick={this.expandBio}>
									{this.state.expname}
								</button>
								<button className="btn btn-default btn-md" ref="addfriend" onClick={this.addFriend}>
									{this.state.frname}
								</button>
							</div>
						</div>

						<div className="w3-card">
		          <GamesList
								user={this.props.user}
								games={this.state.myGames}
								username={this.state.username}
								frname={this.state.frname}
								teams={this.state.myTeams}
								teamgames={this.state.myTeamGames}/>
							<div id="gamesText">
								Friends:<br></br>
								{this.friendsList()}
							</div>
						</div>
					</div>
					<div id="fpanel">
						<div id="feed">
							{this.feed()}
						</div>
					</div>
				</div>
			</div>
			);
	}
};

class GamesList extends React.Component
{
		constructor(props){
			super(props);

		}

    displayGame(game)
    {
			if(game["isprivate"]==false){
        return(
					<tr key={game.id}>
	          <td >{game.sport}</td>
	          <td >{game.name}</td>
	          <td >{game.location}</td>
	          <td><Link to={'/map:'+game.id}>Link</Link></td>
	        </tr>
        );
			}
			else{
				return(
					<tr key={"p"+game.id}>
	          <td >{game.sport}</td>
	          <td >{game.name}</td>
	          <td >private game, cannot view location</td>
	          <td>private game, cannot view details</td>
	        </tr>
        );
			}
    }
		displayGamesMade(game)
    {
			if(game["isprivate"]==false||
			(game["isprivate"]==true&&this.props.frname=="Friends")){
        return(
					<tr key={game.id+"m"}>
	          <td >{game.sport}</td>
	          <td >{game.name}</td>
	          <td >{game.location}</td>
	          <td><Link to={'/map:'+game.id}>Link</Link></td>
	        </tr>
        );
			}
			else{
				return(
					<tr key={"p"+game.id+"m"}>
	          <td >{game.sport}</td>
	          <td >{game.name}</td>
	          <td >private game, cannot view location</td>
	          <td>private game, cannot view details</td>
	        </tr>
        );
			}
    }
		displayTeamGame(game)
    {
			if(game["isprivate"]==false){
        return(
					<tr key={game.id}>
	          <td >{game.sport}</td>
	          <td >{game.name}</td>
	          <td >{game.location}</td>
	          <td><Link to={'/teamgames:'+game.id}>Link</Link></td>
	        </tr>
        );
			}
			else{
				return(
					<tr key={"p"+game.id}>
	          <td >{game.sport}</td>
	          <td >{game.name}</td>
	          <td >private game, cannot view location</td>
	          <td>private game, cannot view details</td>
	        </tr>
        );
			}
    }
		displayTeamGamesMade(game)
    {
			if(game["isprivate"]==false||
			(game["isprivate"]==true&&this.props.frname=="Friends")){
        return(
					<tr key={game.id+"m"}>
	          <td >{game.sport}</td>
	          <td >{game.name}</td>
	          <td >{game.location}</td>
	          <td><Link to={'/teamgames:'+game.id}>Link</Link></td>
	        </tr>
        );
			}
			else{
				return(
					<tr key={"p"+game.id+"m"}>
	          <td >{game.sport}</td>
	          <td >{game.name}</td>
						<td>private game, cannot join</td>
	          <td >private game, cannot view location</td>
	          <td>private game, cannot view details</td>
	        </tr>
        );
			}
    }
		displayTeam(team)
		{
				return(
					<tr key={team._id}>
						<td >{team.sport}</td>
						<td >{team.name}</td>
						<td >{team.location}</td>
						<td><Link to={'/teams:'+team._id}>Link</Link></td>
					</tr>
				);
		}
		displayTeamsMade(team)
		{

				return(
					<tr key={team._id+"m"}>
						<td >{team.sport}</td>
						<td >{team.name}</td>
						<td >{team.location}</td>
						<td><Link to={'/teams:'+team._id}>Link</Link></td>
					</tr>
				);
		}
    render()
    {
			//games
			if (this.props.games==[]) return;
			var gamesList = this.props.games.filter((game)=>{
				{return game['owner']!=this.props.username}
			})
			gamesList = gamesList.map((game) =>
					{return this.displayGame(game)}
			);
			var gamesMade = this.props.games.filter((game)=>{
				{return game['owner']==this.props.username}
			})
			gamesMade = gamesMade.map((game) =>
					{return this.displayGamesMade(game)}
			);

			//teamgames
			if (this.props.teamgames==[]) return;
			var teamGamesList = this.props.teamgames.filter((game)=>{
				{return game['owner']!=this.props.username}
			})
			teamGamesList = teamGamesList.map((game) =>
					{return this.displayTeamGame(game)}
			);
			var teamGamesMade = this.props.teamgames.filter((game)=>{
				{return game['owner']==this.props.username}
			})
			teamGamesMade = teamGamesMade.map((game) =>
					{return this.displayTeamGamesMade(game)}
			);

			//teams
			if (this.props.teams==[]) return;
			var teamsList = this.props.teams.filter((game)=>{
				{return game['captain']!=this.props.username}
			})
			teamsList = teamsList.map((game) =>
					{return this.displayTeam(game)}
			);
			var teamsMade = this.props.teams.filter((game)=>{
				{return game['captain']==this.props.username}
			})
			teamsMade = teamsMade.map((game) =>
					{return this.displayTeamsMade(game)}
			);

        return (
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
	Profile
}
