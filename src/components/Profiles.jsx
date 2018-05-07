var React=require("react");
var ReactDOM=require("react-dom");
require("../css/profiles.css");
var axios=require("axios");


class Profile extends React.Component{
	constructor(props){
		super(props);
		this.expandBio=this.expandBio.bind(this);
		this.addFriend=this.addFriend.bind(this);
		this.state={
			expname:"expand",
			frname:"",
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
	      			this.setState({frname:"add friend"});
	      		}
	      	})

		}).catch((error)=>{
         	console.log(error.response.data);
      	});

	}

    componentWillMount() {
        axios.post("/usergames", {user:this.props.username}, (results) => {
            this.state.games = results.data;
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
		var friends=this.state.friends.filter(
			friend=>friend["req"]=="accepted"
		);
		friends=friends.map((f)=>
			<li key={f["username"]}>{f["username"]}</li>
		)
		return(
			<u1 key="friends">{friends}</u1>
		)
	}
	feed(){
		if(this.state.feed==undefined){return}
		const feed=this.state.feed.map((f)=>
			<li key={f["type"]}>{f["type"]}</li>
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
					<div id="addfriend">
						<button ref="addfriend" onClick={this.addFriend}>
							{this.state.frname}
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
	Profile
}
