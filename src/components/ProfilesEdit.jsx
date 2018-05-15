import React from 'react';
import '../css/profilesEdit.css';
import {Switch,BrowserRouter,Route,browserHistory,Redirect} from 'react-router-dom';
import axios from "axios";


class ProfileEdit extends React.Component{
	constructor(props){
		super(props);
		this.save=this.save.bind(this);
		this.profile=this.profile.bind(this);
		this.settings=this.settings.bind(this);
		this.friendsList=this.friendsList.bind(this);
		this.processFriends=this.processFriends.bind(this);
		this.removeFriend=this.removeFriend.bind(this);
		this.changePicture=this.changePicture.bind(this);
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
	profile(){
		this.props.history.push("/user:"+this.props.username);
	}
	settings(){
		this.props.history.push("/settings:"+this.props.username);
	}
	save(){
		axios({
			url:"/saveprofile",
			method:"post",
			data:{
				"username":this.state.username,
				"alias":this.state.alias,
				"bio":this.state.long,
				"pic":this.state.pic
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
					{f["username"]}
					<span>
						<button
							type="button"
							className="btn btn-danger"
							style = {{margin: '10px'}}
							onClick={()=>{this.removeFriend(f["username"])}}>
							Remove
						</button>
					</span>
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
		<li key={f["username"]}>
			{this.processFriends(f)}
		</li>
	)
	return(
		<ul key="friends">
			{friends}
		</ul>
	)
}
componentDidMount(){
	var usrnm=this.props.username;
	while(!(/[a-z]/i.test(usrnm[0]))){
		usrnm=usrnm.substring(1,usrnm.length);
	}
	console.log(usrnm)
	axios.post("/user",{
			user:usrnm
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
changePicture(e){
	const img=e.target.files[0];
	var type =""
	if(img.name.match(/.*\.jpg/)){
		type=".jpg";
		console.log("jpg")
	}
	else if(img.name.match(/.*\.png/)){
		type=".png";
		console.log("png")
	}
	else{
		console.log("err")
	}
	var data=new FormData();
	data.append("image",img);
	data.append("user",localStorage.getItem("user"));
	data.append("filetype",type);

	/*https://stackoverflow.com/questions/43013858/ajax-post-a-f
	ile-from-a-form-with-axios?utm_medium=organic&utm_source
	=google_rich_qa&utm_campaign=google_rich_qa*/
	axios({
		method:"post",
		url:"/uploadprofilepicture",
		data:data,
		headers:{
      'Content-Type':'multipart/form-data'
    }
	})
}

render(){
	return(
		<div className="profileEdit">

			<div>
					<button
						type="button"
						className="btn btn-info"
						style={{margin:'10px',
							float:'right'}}
							onClick={this.profile}>
							Profile
						</button>


							<button
								type="button"
								className="btn btn-info"
								style={{margin:'10px',
									float:'right'}}
									onClick={this.settings}>
									Settings
								</button>
							</div>

						<div className="pictureEdit" >
							<img src={this.state.pic}>
							</img>

						</div>
						<div className="editImg" ref="editImg">
							<input type="file" accept=".jpg, .png" onChange={(e)=>{this.changePicture(e)}}></input>
						</div>


						<div className="usernameInEdit">
								{this.state.username}
						</div>


						<div className="emailInEdit">
							{this.state.email}
						</div>

						<div className="container">
						<div className="editUsername">
							<form>
								<div>
							<label>Update username:</label>
							<textarea
								className = "form-control"
								rows="1"
								cols="40"
								maxLength="30"
								value={this.state.alias}
								onChange={e=>this.setState({alias:e.target.value})}
								>
							</textarea>
						</div>
						</form>
						</div>

							<form>
								<div className="bioEdit">
							<label>Update your bio:</label>
							<textarea
								className = "form-control"
								rows="10"
								cols="40"
								maxLength="500"
								value={this.state.long}
								onChange={e=>this.setState({long:e.target.value})}
								>
							</textarea>
							</div>
							</form>


								<button
									style = {{float:'right'}}
									type="button"
									className="btn btn-success btn-lg"
									onClick={this.save}>
									Save
								</button>
							</div>



						<div className="friendslistEdit">
							<h2>Friends:</h2>
							<ul>{this.friendsList()}</ul>
						</div>


					</div>
			);
		}
	};



	module.exports={
		ProfileEdit
	}
