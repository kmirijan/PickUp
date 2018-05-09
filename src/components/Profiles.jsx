var React=require("react");
var ReactDOM=require("react-dom");
require("../css/profiles.css");
import {CurrentGamesPrivate} from './CurrentGamesPrivate.jsx';
var axios=require("axios");


class Profile extends React.Component{
	constructor(props){
		super(props);
		this.expandBio=this.expandBio.bind(this);
		this.addFriend=this.addFriend.bind(this);
		this.privateGames=this.privateGames.bind(this);

        var usrnm=this.props.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}

		this.state={
			expname:"expand",
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
	privateGames(){
		if(this.state.frname=="friends"){
			var usrnm=this.props.username;
			while(!(/[a-z]/i.test(usrnm[0]))){
				usrnm=usrnm.substring(1,usrnm.length);
			}
			return (
				<div id="gamesmade">
					<CurrentGamesPrivate user={localStorage.getItem("user")} friend={usrnm}/>
				</div>
			)
		}
	}
	componentDidMount(){

		console.log(this.state.username);
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
				{this.privateGames()}
			</div>
			);
	}
};

class GamesList extends React.Component
{

    displayGame(game)
    {
        return(
            <li key={game.id}>
                <div>Sport {game.sport}</div>
                <div>Location {game.location}</div>
                <div>Name {game.name}</div>
            </li>
        );
    }


    render()
    {
        if (this.props.games==[]) return;
        const gamesList = this.props.games.map((game) =>
            {return this.displayGame(game)}
        );

        return (
            <div>
                <h2>Games Played</h2>
                <ul key="gamesList">{gamesList}</ul>
            </div>
        );

    }

}


module.exports={
	Profile
}
