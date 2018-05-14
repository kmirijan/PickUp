import React from 'react';
import ReactDOM from 'react-dom';
import '../css/profilesEdit.css';
import {Switch,BrowserRouter,Route,browserHistory,Redirect} from 'react-router-dom';
import axios from 'axios';


class ProfileEdit extends React.Component{
	constructor(props){
		super(props);
		this.save=this.save.bind(this);
		this.settings=this.settings.bind(this);
		this.friendsList=this.friendsList.bind(this);
		this.processFriends=this.processFriends.bind(this);
		this.removeFriend=this.removeFriend.bind(this);
		this.changeEmailPrompt=this.changeEmailPrompt.bind(this);
		this.changePasswordPrompt=this.changePasswordPrompt.bind(this);
		this.changeEmail=this.changeEmail.bind(this);
		this.changePassword=this.changePassword.bind(this);
		this.state={
			pic:"",
			long:"",
			username:"",
			alias:"",
			email:"",
			games:[],
			friends:[],
			emailPrompt:[],
			passwordPrompt:[],
			emailError:"",
			passwordError:"",
			newEmail:"",
			oldPassword:"",
			newPassword:"",
			showEmailBox:[],
			showPasswordBox:[]
		}
	}

	changeEmailPrompt(){
	//  this.refs.changeemail.setAttribute("disabled","disabled");
		this.setState({showEmailBox:[]});
		axios({
			method:"post",
			url:"/getemail",
			data:{
				user:localStorage.getItem("user")
			}
		}).then((res)=>{
			this.setState({
				emailPrompt:[
					<div id="emailprompt" key="emailprompt">
						Your current email:{res.data}<br></br>
						New email:
						<input
							id="setemail"
							onChange={event => this.setState({newEmail: event.target.value})}>
						</input>
						<button
							type="button" className="btn btn-success"
							style = {{margin: '20px'}}
							key="changeEmailButton"
							onClick={()=>this.changeEmail(this.state.newEmail)}>
							save
						</button>
					</div>
				]
			})
		//  this.refs.changeemail.removeAttribute("disabled");
		})
	}
	changePasswordPrompt(){
	//  this.refs.changepassword.setAttribute("disabled","disabled");
		this.setState({
			showPasswordPrompt:[],
			passwordPrompt:[
				<div id="passwordprompt" key="passwordprompt">
					Current password:
					<input type="password"
						id="oldpassword"
						onChange={event => this.setState({oldPassword: event.target.value})}>
					</input>
					<br></br>
					New password:
					<input type="password"
						id="newpassword"
						onChange={event => this.setState({newPassword: event.target.value})}>
					</input>
					<button
						type="button" className="btn btn-success"
						key="changePasswordButton"
						style = {{margin: '20px'}}
						onClick={()=>this.changePassword(this.state.oldPassword,this.state.newPassword)}>
						save
					</button>
				</div>
			]
		})
	//  this.refs.changepassword.removeAttribute("disabled");
	}
	changeEmail(newemail){
		//this.refs.changeEmailButton.setAttribute("disabled","disabled");
		if(newemail.match(/.*@.*/)==null){
			this.setState({emailError:"invalid email"})
		}
		else{
			axios({
				method:"post",
				url:"/setemail",
				data:{
					user:localStorage.getItem("user"),
					email:newemail
				}
			}).then((res)=>{
				this.setState({
					emailError:res.data,
					emailPrompt:[],
					newEmail:"",
					showEmailBox:[
						<button type="button" className="btn btn-success" key="changeEmailPrompt"
							style = {{margin: '20px'}}
							onClick={this.changeEmailPrompt}>
							change email
						</button>
					]
				})

				//this.refs.changeEmailButton.removeAttribute("disabled");
			})
		}
	}
	changePassword(oldPassword,newPassword){
		if(newPassword.length<8){
			this.setState({passwordError:"password must be 8 characters long"})
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
					showPasswordBox:[
						<button type="button" className="btn btn-success"
							style = {{margin: '20px'}}
							key="changePasswordPrompt" onClick={this.changePasswordPrompt}>
						change password
						</button>
					]
				})
				//this.refs.changeEmailButton.removeAttribute("disabled");
			})
		}

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
		<div className="container">
			<div>
							<button
								type="button"
								className="btn btn-info"
								style={{margin:'10px',
									float:'right'}}
									onClick={this.settings}>
									Settings
								</button>
							</div>

	    <h1>Edit Profile</h1>
		<div className="row">
	      <div className="col-md-3">
	        <div className="text-center">
	          <img src= "//placehold.it/100" className="avatar img-circle" alt="avatar"/>
	          <h6>Upload a different photo...</h6>

	          <input type="file" className="form-control"/>

	        </div>
	      </div>

	      <div className="col-md-9 personal-info">
	        <h3>Personal info</h3>

	        <form className="form-horizontal" role="form">
						<div className="form-group">
	            <label className="col-lg-3 control-label">Name:</label>
	            <div className="col-lg-8">
	              <input className="form-control" type="text" value={this.state.username}
									/>
	            </div>
	          </div>
	          <div className="form-group">
	            <label className="col-lg-3 control-label">Username:</label>
	            <div className="col-lg-8">
	              <input className="form-control" type="text" value={this.state.alias}
									onChange={e=>this.setState({alias:e.target.value})}/>
	            </div>
	          </div>
	          <div className="form-group">
	            <label className="col-lg-3 control-label">email:</label>
	            <div className="col-lg-8">
	              <input className="form-control" type="text" value={this.state.email}
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
	            <label className="col-md-3 control-label">Password:</label>
	            <div className="col-md-8">
	              <input className="form-control" type="password" value="11111122333"/>
	            </div>
	          </div>
	          <div className="form-group">
	            <label className="col-md-3 control-label">Confirm password:</label>
	            <div className="col-md-8">
	              <input className="form-control" type="password" value="11111122333"/>
	            </div>
	          </div>
	          <div className="form-group">
	            <label className="col-md-3 control-label"></label>
	            <div className="col-md-8">
	              <input type="button" className="btn btn-primary" value="Save Changes" onClick={this.save}/>
	              <span></span>
	              <input type="reset" className="btn btn-default" value="Cancel"/>
	            </div>
	          </div>
						<div id="changeemailbox">
							<button type="button" className="btn btn-success" key="changeEmailPrompt" onClick={this.changeEmailPrompt}
								style = {{margin: '20px'}}>
								change email
							</button>
							<div id="emailbox" ref="emailbox" style = {{margin: '20px'}}>
								{this.state.emailPrompt}
								{this.state.emailError}
							</div>
						</div>
						<div id="changepasswordbox">
							<button type="button" className="btn btn-success" key="changePasswordPrompt" onClick={this.changePasswordPrompt}
								style = {{margin: '20px'}}>
							change password
							</button>
							<div id="passwordbox" ref="passwordbox" style = {{margin: '20px'}}>
								{this.state.passwordPrompt}
								{this.state.passwordError}
							</div>
						</div>
	        </form>
	      </div>
	  </div>
		<div className="friendslistEdit">
							<h2>Friends:</h2>
							<ul>{this.friendsList()}</ul>
						</div>

	</div>
			);
		}
	};



	export default ProfileEdit;
