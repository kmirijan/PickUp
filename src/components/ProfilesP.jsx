var React=require("react");
var ReactDOM=require("react-dom");
require("../css/profiles.css");
var {Switch,BrowserRouter,Route,browserHistory,Redirect}=require('react-router-dom');
var axios=require("axios");


class ProfileP extends React.Component{
	constructor(props){
		super(props);
		this.expandBio=this.expandBio.bind(this);
		this.edit=this.edit.bind(this);
		this.settings=this.settings.bind(this);
		this.processFeed=this.processFeed.bind(this);
		this.acceptFriendreq=this.acceptFriendreq.bind(this);
		this.declineFriendreq=this.declineFriendreq.bind(this);


        var usrnm=this.props.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}

		this.state={
			expname:"expand",
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
	settings(){
		this.props.history.push("/settings:"+this.props.username);
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
	componentDidMount(){

		console.log('"',this.state.username,'"')
		axios.post("/user",{
			params:{
				name:this.state.username
			}
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
			<li key={f["username"]}>{f["username"]}</li>
		)
		return(
			<ul key="friends">{friends}</ul>
		)
	}
	acceptFriendreq(friend){
		this.refs.friendaccept.setAttribute("disabled","disabled");
		axios({
			method:"post",
			url:"/acceptfriend",
			data:{
				"user":localStorage.getItem("user"),
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
				"user":localStorage.getItem("user"),
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
						{f["sender"]} sent you a friend request!
					</p>
					<button
						ref="friendaccept"
						onClick={()=>this.acceptFriendreq(f["sender"])}>
						accept
					</button>
					<button
						ref="frienddecline"
						onClick={()=>this.declineFriendreq(f["sender"])}>
						decline
					</button>
				</div>
			)
		}
		else{return}
	}
	feed(){
		if(this.state.feed==undefined){return}
		const feed=this.state.feed.map((f)=>
			<li key={f["type"]}>{this.processFeed(f)}</li>
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
		return(
			<div id="profile">
				<div id="panel">
				<div id = "card">
						<div id="picture">
							<img src={this.state.pic}></img>
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
							<button onClick={this.edit}>
								edit
							</button>
							<button onClick={this.settings}>
								settings
							</button>
							<button onClick={this.expandBio}>
								{this.state.expname}
							</button>
						</div>
					</div>

					<GamesList games={this.state.myGames}/>
					<div id="friendsList">
						Friends:<br></br>
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
    displayGame(game)
    {
        return (
            <li key={game.id}>
                <div>Sport {game.sport}</div>
                <div>Location {game.location}</div>
                <div>Name {game.name}</div>
            </li>
        );
    }

    render()
    {
        if(this.props.games==[]){return}
   		const gamesList=this.props.games.map((game)=>
    		{return this.displayGame(game)}
	    );

        return(
            <div>
                <h2>Games Played</h2>
        		<ul key="gamesList">{gamesList}</ul>
            </div>
	    );
    }

}


module.exports={
	ProfileP
}
