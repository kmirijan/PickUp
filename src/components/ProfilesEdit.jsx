var React=require("react");
var ReactDOM=require("react-dom");
require("../css/profiles.css");
var {Switch,BrowserRouter,Route,browserHistory,Redirect}=require('react-router-dom');
var axios=require("axios");


class ProfileEdit extends React.Component{
	constructor(props){
		super(props);
		this.save=this.save.bind(this);
		this.state={
			pic:"",
			long:"",
			username:"",
			alias:"",
			email:"",
			games:[],
		}
	}
	save(){
		axios({
			url:"/saveprofile",
			method:"post",
			data:{
				"username":this.state.username,
				"alias":this.state.alias,
				"bio":this.state.long
			}
		}).then(()=>{
			console.log("saved");
			this.props.history.push("/user"+this.props.username);
		});
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
				email:userStates["email"],
				games:userStates["games"]
			});

		}).catch((error)=>{
         	console.log(error.response.data);
      	});

	}
	componentDidUpdate(prevProps,prevState){
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
					<div id="alias" ref="alias">
						<textarea
							rows="1"
							cols="40"
							maxlength="30"
							value={this.state.alias}
							onChange={e=>this.setState({alias:e.target.value})}
						>
						</textarea>
					</div>
					<div id="bio" ref="bio">
						<textarea
							rows="10"
							cols="40"
							maxlength="500"
							value={this.state.long}
							onChange={e=>this.setState({long:e.target.value})}
						>
						</textarea>
					</div>
					<div id="save">
						<button onClick={this.save}>
							save
						</button>
					</div>
				</div>
			</div>
			);
	}
};



module.exports={
	ProfileEdit,
}
