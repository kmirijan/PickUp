var React=require("react");
var ReactDOM=require("react-dom");
require("../css/profiles.css");
var {Switch,BrowserRouter,Route,browserHistory,Redirect}=require('react-router-dom');
var axios=require("axios");
var {Link}=require('react-router-dom');


class ProfileP extends React.Component{
	constructor(props){
		super(props);
		console.log("USER",this.props.user);
		this.expandBio=this.expandBio.bind(this);
		this.edit=this.edit.bind(this);
		this.processFeed=this.processFeed.bind(this);
		this.acceptFriendreq=this.acceptFriendreq.bind(this);
		this.declineFriendreq=this.declineFriendreq.bind(this);


        var usrnm=this.props.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}

		this.state={
			expname:"Expand",
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
      myGames:[]

		}
	}
	edit(){
		this.props.history.push("/edit:"+this.props.username);
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
	componentDidMount(){

		console.log('"',this.state.username,'"')
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
				friends:userStates["friends"],
				feed:userStates["feed"],
			});
			//make bio shorter
	      	if(this.state.long.length>100){
	      		this.setState({short:this.state.long.substring(0,100)});
	      	}

		}).catch((error)=>{
         	console.log(error.response.data);
      	});

	}

    componentWillMount() {
        axios.post("/usergames", {user:this.state.username}).then( (results) => {
            this.setState({myGames : results.data});
        });
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
			<ul className="list-group" key="friends">{friends}</ul>
		)
	}
	acceptFriendreq(friend){
		this.refs.friendaccept.setAttribute("disabled","disabled");
		axios({
			method:"post",
			url:"/acceptfriend",
			data:{
				"user":this.props.user,
				"friend":friend,
			}
		}).then((res)=>{
			this.setState(res.data);
			this.refs.friendaccept.removeAttribute("disabled");
		})
	}
	declineFriendreq(friend){
		this.refs.frienddecline.setAttribute("disabled","disabled");
		axios({
			method:"post",
			url:"/declinefriend",
			data:{
				"user":this.props.user,
				"friend":friend,
			}
		}).then((res)=>{
			this.setState(res.data);
			this.refs.frienddecline.removeAttribute("disabled");
		})
	}
	processFeed(f){
		if(f["type"]=="friendreq"){
			return(
				<div>
					<p>
						{f["sender"]} Sent you a friend request!
					</p>
					<button
						ref="friendaccept"
						className="btn btn-success"
						onClick={()=>this.acceptFriendreq(f["sender"])}>
						Accept
					</button>
					<button
						ref="frienddecline"
						className="btn btn-danger"
						onClick={()=>this.declineFriendreq(f["sender"])}>
						Decline
					</button>
				</div>
			)
		}
		else{return}
	}
	feed(){
		if(this.state.feed==undefined){return}
		const feed=this.state.feed.map((f)=>
			<li className="list-group-item" key={f["type"]}>{this.processFeed(f)}</li>
		)
		return(
			<ul className="list-group" key="feed">{feed}</ul>
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
				<div id="panel">
				<div id = "card">
						<div id="picture">
							<img src={this.state.pic} style={picStyle}></img>
							<div id="mask"></div>
							<p id="changeimg">change picture</p>
						</div>

						<div id="alias">
							{this.state.alias}
						</div>

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
							<button
								className="btn btn-primary"
								onClick={this.edit}>
								Edit
							</button>
							<button
								className="btn btn-secondary"
								onClick={this.expandBio}>
								{this.state.expname}
							</button>
						</div>
					</div>

					<GamesList games={this.state.myGames} user={this.props.user}/>
					<div id="friendsList">
						<h2>Friends:</h2><br></br>
						{this.friendsList()}
					</div>
				</div>



				<div id="fpanel">
					<h1>FEED</h1>
					<div id="feed">
						{this.feed()}
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
			this.deleteGame=this.deleteGame.bind(this);
			this.displayGame=this.displayGame.bind(this);
			this.state={
				games:[],
				deleteGameClicked:false
			}
		}
		deleteGame(gameId){
			if(this.state.deleteGameClicked==false){
				if(confirm("delete game?")){
					axios({
						method:"post",
						url:"/deletegame",
						data:{
							gameId:gameId
						}
					}).then(()=>{
						console.log("game deleted");
						this.setState({
							deleteGameClicked:true
						})
					})
				}
			}
		}
		componentDidUpdate(){
			if(this.state.deleteGameClicked==true){
				axios.post("/usergames", {user:this.props.user}).then( (results) => {
						this.setState({games : results.data});
				})
				this.setState({deleteGameClicked:false});
			}
		}
		componentWillMount(){
				axios.post("/usergames", {user:this.props.user}).then( (results) => {
						this.setState({games : results.data});
				});
		}
    displayGame(game)
    {
        return (
					<tr key={game.id}>
						<td >{game.sport}</td>
						<td >{game.name}</td>
						<td >{game.location}</td>
						<td><Link to={"/game:"+game.id}>Details</Link></td>
					</tr>
        )
    }
		displayGamesMade(game){
			return (
				<tr key={game.id}>
					<td >{game.sport}</td>
					<td >{game.name}</td>
					<td >{game.location}</td>
					<td><Link to={"/game:"+game.id}>Details</Link></td>
					<td><button className="btn btn-danger"
						onClick={()=>{this.deleteGame(game.id)}}>
						Delete
					</button></td>
				</tr>
			)
		}
    render()
    {
			if (this.props.games==[]) return;
			var gamesList = this.state.games.filter((game)=>{
				{return game["owner"]!=this.props.user}
			})
			gamesList = gamesList.map((game) =>
					{return this.displayGame(game)}
			);
			var gamesMade = this.state.games.filter((game)=>{
				{return game["owner"]==this.props.user}
			})
			gamesMade = gamesMade.map((game) =>
					{return this.displayGamesMade(game)}
			);

        return(
					<div>
						<h2>Games Played</h2>
						<table classNaem="table table-bordered table-hover">
							<tbody key="gamesList">{gamesList}</tbody></table>
						<h2>Games Made</h2>
						<table><tbody key="gamesMadeList">{gamesMade}</tbody></table>
					</div>
	    );
    }

}


module.exports={
	ProfileP
}
