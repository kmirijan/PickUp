var React=require("react");
var ReactDOM=require("react-dom");
var {Profile}=require("./Profiles.jsx");
var {ProfileP}=require("./ProfilesP.jsx");
var {ProfileEdit}=require("./ProfilesEdit.jsx");
var {CurrentGames}=require("./CurrentGames.js");
var {CurrentTeams}=require("./CurrentTeams.jsx");
var {CurrentTeamGames}=require("./CurrentTeamGames.jsx");
var {Users}=require("../helpers/Users.jsx");
var{GamePage}=require("./GamePage.jsx");
var{ProfileSettings}=require("./ProfilesSettings.jsx");
var axios=require("axios");
require("../css/App.css");
require("../css/font.css");
import NavBar from './NavBar';
import SignUp from './SignUp';
import SignIn from './SignIn';
import App from "./App";
import Home from "./Home";
import Map from "./Map";
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');


class Routes extends React.Component{
    render(){
      if(localStorage.getItem("loggedin")=="true"){
        return(

            <BrowserRouter>
                <Switch>
                	<Route exact path="/" component={NavBar} />
                	<Route exact path="/home" component={Home} />
                    <Route path="/users" component={Users} />
                    <Route path='/user:username' component={User}/>
                    <Route path="/edit:username" component={Edit}/>
                    <Route path="/settings:username" component={Settings}/>
                    <Route path="/game:id" component={RenderGamePage}/>
                    <Route path="/map" component={Map}/>
                    <Route path="/teams" component={CurrentTeams} user={getCurrentUser()}/>
                    <Route path="/teamgames" component={CurrentTeamGames} user={getCurrentUser()}/>
                    <Route path="/app"
                        render={(props) => <App user = {getCurrentUser()}/>}/>
                    <Route path="/signin" component={SignIn}/>
          					<Route path="/signup" component={SignUp}/>
          					<Route path="/logout" component={LogOut}/>
                    <Route component={_404} />
                </Switch>
            </BrowserRouter>
        )
      }
      else{
        return(

            <BrowserRouter>
                <Switch>
                	<Route exact path="/" component={NavBar} />
                	<Route exact path="/home" component={Home} />
                  <Route path="/signin" component={SignIn}/>
				          <Route path="/signup" component={SignUp}/>
                  <Route component={_404} />
                </Switch>
            </BrowserRouter>
        )
      }
    }
}

function getCurrentUser()
{
    let user = localStorage.getItem("user");
    console.log("user: ", user);
    if (user != "")
    {
        return user;
    }
    else
    {
        return "guest";
    }
}


class User extends React.Component{
	constructor(props){
		super(props);
    var usrnm=this.props.match.params.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}
    this.usrnm=usrnm;
    this.isValidUser=false;
	}
	componentWillMount(){
		if(!(localStorage.getItem("loggedin")=="true")){
			alert("Must be logged in to find users")
			this.props.history.push("/signin");
		}
    axios({
      method:"post",
      url:"/isuser",
      data:{
        "user":this.usrnm
      }
    })
    .then((isUser)=>{
      console.log(isUser.data)
      this.isValidUser=isUser.data;
      this.forceUpdate();
    })
	}
  componentWillReceiveProps(props){
    console.log(props);
    var usrnm=props.match.params.username;
     while(!(/[a-z]/i.test(usrnm[0]))){
       usrnm=usrnm.substring(1,usrnm.length);
     }
      this.usrnm=usrnm;
      this.forceUpdate();
  }
	render(){
		if((localStorage.getItem("loggedin")=="true")&&(localStorage.getItem("user")==this.usrnm))
		{
			console.log("hello world");
			return(
				<div>
				<NavBar />
				<ProfileP
					username={this.usrnm}
					history={this.props.history}
				/>
				</div>
		)}
    else if(localStorage.getItem("loggedin")=="true" && this.isValidUser==true){
  			return(
  				<div>
  				<NavBar />
  				<Profile
  					username={this.usrnm}
  					history={this.props.history}
  				/>
  				</div>
  		)}
		else{
      console.log(this.isValidUser);
			return(<_404/>);
		}
	};
};
class Edit extends React.Component{
	render(){
		var usrnm=this.props.match.params.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}
		if((localStorage.getItem("loggedin")=="true")&&(localStorage.getItem("user")==usrnm))
		{
			return(
        <div>
          <NavBar />
          <div className = "editPage">
            <ProfileEdit
              username={usrnm}
              history={this.props.history}
              />
          </div>
        </div>
			)}
		else{
			return(<_404/>)
		}
	}
}
class Settings extends React.Component{
	render(){
		var usrnm=this.props.match.params.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}
		if((localStorage.getItem("loggedin")=="true")&&(localStorage.getItem("user")==usrnm))
		{
			return(
				<div>
					<NavBar />
					<ProfileSettings
						username={usrnm}
						history={this.props.history}
					/>
				</div>
			)}
		else{
			return(<_404/>)
		}
	}
}

class RenderGamePage extends React.Component{
  constructor(props){
    super(props);
    this.id=this.props.match.params.id;
    while(!(/[0-9]|[a-z]/i.test(this.id[0]))){
			this.id=this.id.substring(1,this.id.length);
		}
    this.isGame=false;
  }
  componentWillMount(){
    axios({
      method:"post",
      url:"/isgame",
      data:{
        id:this.id
      }
    }).then((isGame)=>{
      this.isGame=isGame.data;
      this.forceUpdate();
    })
  }
  render(){
    console.log("gametrue",this.isGame);
    console.log("loggedin",localStorage.getItem("loggedin"))
    if(this.isGame==true&&localStorage.getItem("loggedin")=="true"){

      return(<GamePage id={this.id}/>)
    }
    else{
      return(<_404/>)
    }
  }
}

class LogOut extends React.Component{
	componentDidMount(){
		localStorage.setItem("loggedin",false);
        localStorage.setItem("user","");
        this.props.history.push("/signin");
	}
	render(){
        return(<_404 />);
	}
}
const _404=()=>(
	<h1>404</h1>
);



module.exports={
	Routes,
	_404
}
