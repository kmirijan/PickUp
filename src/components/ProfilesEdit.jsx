import React from 'react';
import '../css/profilesEdit.css';
import {Switch,BrowserRouter,Route,browserHistory,Redirect} from 'react-router-dom';
import axios from "axios";


class ProfileEdit extends React.Component{
	constructor(props){
		super(props);
		this.save=this.save.bind(this);
		this.friendsList=this.friendsList.bind(this);
		this.processFriends=this.processFriends.bind(this);
		this.removeFriend=this.removeFriend.bind(this);
		this.state={
			pic:"",
			long:"",
			username:"",
			alias:"",
			email:"",
			games:[],
			friends:[]
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
	removeFriend(friend){
		this.refs.removefriend.setAttribute("disabled","disabled");
		if(confirm("remove "+friend+" ?")){
			axios({
				method:"post",
				url:"/removefriend",
				data:{
					"user":localStorage.getItem("user"),
					"friend":friend,
				}
			}).then((res)=>{
				this.setState(res.data);
				this.refs.removefriend.removeAttribute("disabled");
			})
		}
		else{
			this.refs.removefriend.removeAttribute("disabled");
			return;
		}
	}
	processFriends(f){
		return(
			<div>
				<p>
					{f["username"]}
				</p>
				<button type="button" className="btn btn-danger" onClick={()=>{this.removeFriend(f["username"])}}>
					remove
				</button>
			</div>
		)
	}
	friendsList(){
		if(this.state.friends==undefined){return}
		var friends=this.state.friends.filter(
			friend=>{
				return (friend["req"]=="accepted")
			}
		);
		friends=friends.map((f)=>
			<li key={f["username"]}>{this.processFriends(f)}</li>
		)
		return(
			<u1 key="friends">{friends}</u1>
		)
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
				games:userStates["games"],
				friends:userStates["friends"],
				feed:userStates["feed"]
			});

		}).catch((error)=>{
         	console.log(error.response.data);
      	});

	}
	componentDidUpdate(prevProps,prevState){
	}
	render(){
		return(
			<div className = "EditProfile">
				<div>
					<div className="pictureEdit">
						<img src={this.state.pic}></img>
						<div></div>
						<p className="editImg">change picture</p>
					</div>
					<div className="usernameInEdit">
						{this.state.username}
					</div>
					<div className="emailInEdit">
						{this.state.email}
					</div>
					<div className="editUsername">
						<textarea
							rows="1"
							cols="40"
							maxlength="30"
							value={this.state.alias}
							onChange={e=>this.setState({alias:e.target.value})}
						>
						</textarea>
					</div>
					<div className="bioEdit">
						<textarea
							rows="10"
							cols="40"
							maxlength="500"
							value={this.state.long}
							onChange={e=>this.setState({long:e.target.value})}
						>
						</textarea>
					</div>
					<div className="saveEdit">
						<button type="button" className="btn btn-success" onClick={this.save}>
							save
						</button>
					</div>
					<div className="friendslistEdit">
						friends:
						{this.friendsList()}
					</div>
				</div>
			</div>
			);
	}
};



module.exports={
	ProfileEdit
}
