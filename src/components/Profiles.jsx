var React=require("react");
var ReactDOM=require("react-dom");
require("../css/profiles.css");
var axios=require("axios");
var {Link}=require('react-router-dom');


class Profile extends React.Component{
	constructor(props){
		super(props);
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
            myGames:[]
		}
	}
	expandBio(){
		if(this.state.expanded==false){
			this.setState({expanded:true});
			this.setState({expname:"collapse"});
		}
		else{
			this.setState({expanded:false});
			this.setState({expname:"expand"});
		}
	}
	addFriend(){
		if(this.state.frname=="pending request"||this.state.frname=="friends"){
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
					"user":localStorage.getItem("user"),
					"friend":this.state.username,
				}
			}).then(()=>{
				this.setState({frname:"pending request"});
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
	      			"user":localStorage.getItem("user"),
	      			"friend":this.state.username
	      		}
	      	}).then((res)=>{
	      		if(res.data=="pending"){
	      			this.setState({frname:"pending request"});
	      		}
	      		else if(res.data=="accepted"){
	      			this.setState({frname:"friends"});
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
    }

	gamesList(){
		if(this.state.games==undefined){return}
		const gamesList=this.state.games.map((games)=>
			<li key={games["game"]}>{games["game"]}</li>
		)
		return(
			<ul key="gamesList">{gamesList}</ul>
		)
	}

	friendsList(){
		if(this.state.friends==undefined){return}
		var friends=this.state.friends.filter(
			friend=>friend["req"]=="accepted"
		);
		friends=friends.map((f)=>
			<li key={f["username"]}>{f["username"]}</li>
		)
		return(
			<ul key="friends">{friends}</ul>
		)
	}
	feed(){
		if(this.state.feed==undefined){return}
		const feed=this.state.feed.map((f)=>
			<li key={f["type"]}>{f["type"]}</li>
		)
		return(
			<ul key="feed">{feed}</ul>
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
		          <GamesList games={this.state.myGames} username={this.state.username} frname={this.state.frname}/>
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
			this.joinGame=this.joinGame.bind(this);
		}
		joinGame(game)
		{
		  axios.post('/join', {uid:localStorage.getItem("user"), gid:game.id});
		}
    displayGame(game)
    {
			if(game["isprivate"]==false){
        return(
					<tr key={game.id}>
	          <td ><h3>{game.sport} </h3></td>
	          <td ><h3>{game.name} </h3></td>
	          <td > <h3>{game.location}</h3> </td>
	          <td><Link to={"/game:"+game.id}><h3>Details</h3></Link></td>
	        </tr>
        );
			}
			else{
				return(
					<tr key={"p"+game.id}>
	          <td ><h3>{game.sport} </h3></td>
	          <td ><h3>{game.name} </h3></td>
	          <td >private game, cannot view location</td>
	          <td>private game, cannot view details</td>
	        </tr>
        );
			}
    }
		displayGamesMade(game)
    {
			if(game["isprivate"]==false){
        return(
					<tr key={game.id}>
	          <td ><h3>{game.sport} </h3></td>
	          <td ><h3>{game.name} </h3></td>
	          <td > <h3>{game.location}</h3> </td>
						<td><button className="joinGame" onClick={()=>{this.joinGame(game)}}><h3>Join</h3></button></td>
	          <td><Link to={"/game:"+game.id}><h3>Details</h3></Link></td>
	        </tr>
        );
			}
			else if(game["isprivate"]==true&&this.props.frname=="friends"){
				return(
					<tr key={"p"+game.id}>
						<td ><h3>{game.sport} </h3></td>
						<td ><h3>{game.name} </h3></td>
						<td > <h3>{game.location}</h3> </td>
						<td><button className="joinGame" onClick={()=>{this.joinGame(game)}}><h3>Join</h3></button></td>
	          <td><Link to={"/game:"+game.id}><h3>Details</h3></Link></td>
					</tr>
				);
			}
			else{
				return(
					<tr key={"p"+game.id}>
	          <td ><h3>{game.sport} </h3></td>
	          <td ><h3>{game.name} </h3></td>
						<td>private game, cannot join</td>
	          <td >private game, cannot view location</td>
	          <td>private game, cannot view details</td>
	        </tr>
        );
			}
    }


    render()
    {
        if (this.props.games==[]) return;
				var gamesList = this.props.games.filter((game)=>{
					{return game["owner"]!=this.props.username}
				})
        gamesList = gamesList.map((game) =>
            {return this.displayGame(game)}
        );
				var gamesMade = this.props.games.filter((game)=>{
					{return game["owner"]==this.props.username}
				})
				gamesMade = gamesMade.map((game) =>
            {return this.displayGamesMade(game)}
        );

        return (
            <div>
                <h2 id="gamesText">Games Played:</h2>
                <table><tbody key="gamesList">{gamesList}</tbody></table>
								<h2 id="gamesText">Games Made:</h2>
								<table><tbody key="gamesMadeList">{gamesMade}</tbody></table>

            </div>
        );

    }

}


module.exports={
	Profile
}
