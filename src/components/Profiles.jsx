var React=require("react");
var ReactDOM=require("react-dom");
var {Top,Rest}=require("./Main.jsx");
require("../css/profiles.css");
var axios=require("axios");


class Profile extends React.Component{
	constructor(props){
		super(props);
		this.expandBio=this.expandBio.bind(this);
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
				games:userStates["games"]
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
		const gamesList=this.state.games.map((games)=>
			<li key={games["game"]}>{games["game"]}</li>
		)
		return(
			<u1 key="gamesList">{gamesList}</u1>
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
				</div>
			</div>
			);
	}
};


class Feed extends React.Component{
	constructor(props){
		super(props);

		this.state={
			games:"to be implemented",
			expanded:false,
			
		}
	}
	render(){
		return(
			<div id="feed">
				<div id="fpanel">
					<h1>FEED</h1>
					<p>{this.state.games}</p>
				</div>
			</div>
			);
	};
};
module.exports={
	Profile,
	Feed
}