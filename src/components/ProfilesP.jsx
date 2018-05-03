var React=require("react");
var ReactDOM=require("react-dom");
var {Top,Rest}=require("./Main.jsx");
require("../css/profiles.css");
var {Switch,BrowserRouter,Route,browserHistory,Redirect}=require('react-router-dom');
var axios=require("axios");


class ProfileP extends React.Component{
	constructor(props){
		super(props);
		this.expandBio=this.expandBio.bind(this);
		this.edit=this.edit.bind(this);
		this.processFeed=this.processFeed.bind(this);
		this.acceptFriendreq=this.acceptFriendreq.bind(this);
		this.declineFriendreq=this.declineFriendreq.bind(this);
		this.state={
			expname:"expand",
			expanded:false,
			pic:"",
			short:"",
			long:"",
			username:"",
			alias:"",
			email:"",
			games:[],
			friends:[],
			feed:[]
		}
	}
	edit(){
		this.props.history.push("/edit"+this.props.username);
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
		var usrnm=this.props.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}
		console.log(usrnm)
		axios.post("/user",{
			params:{
				name:usrnm
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
				feed:userStates["feed"]
			});
			//make bio shorter
	      	if(this.state.long.length>100){
	      		this.setState({short:this.state.long.substring(0,100)});
	      	}
		
		}).catch((error)=>{
         	console.log(error.response.data);
      	});
      	
	}
	gamesList(){
		if(this.state.games==undefined){return}
		const gamesList=this.state.games.map((games)=>
			<li key={games["game"]}>{games["game"]}</li>
		)
		return(
			<u1 key="gamesList">{gamesList}</u1>
		)
	}
	friendsList(){
		if(this.state.friends==undefined){return}
		const friendsList=this.state.friends.map((friends)=>
			<li key={friends["user"]}>{friends["username"]}</li>
		)
		return(
			<u1 key="friendsList">{friendsList}</u1>
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
	declineFriendreq(){

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
			<u1 key="feed">{feed}</u1>
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
					<div id="edit">
						<button onClick={this.edit}>
							edit
						</button>
					</div>
					<div id="picture">
						<img src={this.state.pic}></img>
						<div id="mask"></div>
						<p id="changeimg">change picture</p>
					</div>
					<div id="username">
						{this.state.username}
					</div>
					<div id="email">
						{this.state.email}
					</div>
					<div id="alias">
						{this.state.alias}
					</div>
					<div id="bio" ref="bio">
						{this.state.short}
					</div>
					<div id="expand">
						<button onClick={this.expandBio}>
							{this.state.expname}
						</button>
					</div>
					<div id="gamesList">
						Games created:<br></br>
						{this.gamesList()}
					</div>
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
};


module.exports={
	ProfileP
}