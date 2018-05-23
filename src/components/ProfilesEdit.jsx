import React from 'react';
import {Switch,BrowserRouter,Route,browserHistory,Redirect} from 'react-router-dom';
import axios from "axios";


class ProfileEdit extends React.Component{
	constructor(props){
		super(props);
		this.save=this.save.bind(this);
		this.profile=this.profile.bind(this);
		this.friendsList=this.friendsList.bind(this);
		this.processFriends=this.processFriends.bind(this);
		this.removeFriend=this.removeFriend.bind(this);
		this.changePicture=this.changePicture.bind(this);
		this.changePasswordPrompt=this.changePasswordPrompt.bind(this);
		this.changePassword=this.changePassword.bind(this);
		this.state={
			pic:"",
			long:"",
			username:"",
			alias:"",
			email:"",
			games:[],
			friends:[],
      passwordPrompt:[],
      passwordError:"",
      oldPassword:"",
      newPassword:"",
      showPasswordBox:[]
		}
	}
	profile(){
		this.props.history.push("/user:"+this.props.username);
	}

	save(){
			axios({
				url:"/saveprofile",
				method:"post",
				data:{
					"username":this.state.username,
					"alias":this.state.alias,
					"bio":this.state.long,
					"pic":this.state.pic,
					"email":this.state.email
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

changePasswordPrompt(){
//  this.refs.changepassword.setAttribute("disabled","disabled");
	this.setState({
		passwordPrompt:[
			<div className="passwordChange">
			<div className="form-group">
				<label className="col-lg-3 control-label">Current Password:</label>
				<div className="col-lg-8">
					<input className="form-control" type="password"
						id="oldpassword"
						onChange={event => this.setState({oldPassword: event.target.value})}
						/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-lg-3 control-label">New Password:</label>
				<div className="col-lg-8">
					<input className="form-control" type="password"
						id="newpassword"
						onChange={event => this.setState({newPassword: event.target.value})}
						/>
				</div>
			</div>

			<div className="form-group">
				<label className="col-md-3 control-label"></label>
				<div className="col-md-8">
					<input type="button" className="btn btn-primary" value="Save Changes"
					onClick={()=>this.changePassword(this.state.oldPassword,this.state.newPassword)}/>
					<span></span>
					<input type="reset" className="btn btn-default" value="Cancel"/>
				</div>
			</div>
		</div>
		]
	})
//  this.refs.changepassword.removeAttribute("disabled");
}

changePassword(oldPassword,newPassword){
	if(newPassword.length<8){
		this.setState({passwordError:"Password must be at least 8 characters long"})
	}
	else{
		axios({
			method:"post",
			url:"/setpassword",
			data:{
				user:localStorage.getItem("user"),
				oldPassword:oldPassword,
				newPassword:newPassword
			}
		}).then((res)=>{
			this.setState({
				passwordError:res.data,
				passwordPrompt:[],
				oldPassword:"",
				newPassword:"",
			})
			//this.refs.changeEmailButton.removeAttribute("disabled");
		})
	}

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
	data.append("user",localStorage.getItem("user"));
	data.append("filetype",type);
	data.append("image",img);


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
	}).then(()=>{
		this.props.history.push("/user"+this.props.username);
		window.location.reload();
	})
}

render(){
	const picStyle={
		"maxWidth":"200px",
		"maxHeight":"200px"
	}
	return(
		<div className="container">
			<h1>Edit Profile</h1>
		<div className="row">
				<div className="col-md-3">
					<div className="text-center">
						<img src={this.state.pic} style={picStyle} className="avatar img-circle" alt="avatar"/>
						<h6>Upload a different photo...</h6>

						<input type="file" accept=".jpg, .png" className="form-control" onChange={(e)=>this.changePicture(e)}/>

					</div>
				</div>

				<div className="col-md-9 personal-info">
					<h3>Personal info</h3>

					<form className="form-horizontal" role="form">
						<div className="form-group">
							<label className="col-lg-3 control-label">Name:</label>
							<div className="col-lg-8">
									<input className="form-control" type="text" value={this.state.alias}
										onChange={e => this.setState({alias: e.target.value})}
										/>
							</div>
						</div>
						<div className="form-group">
							<label className="col-lg-3 control-label">Username:</label>
							<div className="col-lg-8">
								<input className="form-control" type="text" value={this.state.username}
									readOnly
									/>
							</div>
						</div>
						<div className="form-group">
							<label className="col-lg-3 control-label">email:</label>
							<div className="col-lg-8">
								<input className="form-control" type="text" value={this.state.email}
									onChange={e => this.setState({email: e.target.value})}
									/>
							</div>
						</div>
						<div className="form-group">
							<label className="col-lg-3 control-label">Bio:</label>
							<div className="col-lg-8">
								<textarea className="form-control" type="text"
									rows="10"
									cols="40"
									maxlength="500"
									value={this.state.long}
									onChange={e=>this.setState({long:e.target.value})}>
								</textarea>
							</div>
						</div>
						<div className="form-group">
							<label className="col-md-3 control-label"></label>
							<div className="col-md-8">
								<input type="button" className="btn btn-primary" value="Save Changes"
									 onClick={this.save}/>
								<span></span>
								<input type="reset" className="btn btn-default" value="Cancel"/>
							</div>
						</div>

						<div className="form-group">
							<label className="col-md-3 control-label"></label>
							<div className="col-md-8">
								<input type="button" className="btn btn-primary"
									value="Change Password"
									onClick={this.changePasswordPrompt}/>
							</div>
							<div className="form-group" ref="passwordbox">
								<label className="col-md-3 control-label"></label>
								<div className="col-md-8">
								{this.state.passwordPrompt}
								{this.state.passwordError}
							</div>
							</div>
						</div>

						</form>
				</div>
		</div>
	</div>
			);
		}
	};



	module.exports={
		ProfileEdit
	}
