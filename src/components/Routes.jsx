var React=require("react");
var ReactDOM=require("react-dom");
var {Profile}=require("./Profiles.jsx");
var {ProfileP}=require("./ProfilesP.jsx");
var {ProfileEdit}=require("./ProfilesEdit.jsx");
var {TeamPage}=require("./TeamPage.jsx");
var {CurrentTeamGames}=require("./CurrentTeamGames.jsx");
var {Users}=require("../helpers/Users.jsx");
var{GamePage}=require("./GamePage.jsx");
var{TeamGamePage}=require("./TeamGamePage.jsx");
var{ProfileSettings}=require("./ProfilesSettings.jsx");
var axios=require("axios");
import loadImg from "../../dist/load.gif"
require("../css/App.css");
require("../css/font.css");
import NavBar from './NavBar';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Home from "./Home";
import Map from "./Map";
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');
import Login from "../helpers/login.js";
import Cookies from 'universal-cookie';




class Routes extends React.Component{
  constructor(props){
    super(props);
    this.loading=true;
    this.state={
      user:null,
      loading:true
    }
  }
  componentWillMount(){
    console.log("router will mount");
    const cookies = new Cookies();
    Login.verify(cookies.get("key"),(user)=>{
      console.log("the user",user);
      if(user!=null){
        console.log("valid user")
      }
      else{
        console.log("invalid user")
      }

      this.setState({
        user:user,
        loading:false
      })
    })
  }
  componentWillReceiveProps(){
    console.log("router received props");
    this.forceUpdate();
  }
    render(){
      console.log(this.state.loading)
      if(this.state.loading==true){
        return(<Loading/>)
      }
      else if(this.state.user!=null){
        return(
            <BrowserRouter>
                <Switch>
                	<Route exact path="/" render={(props)=><Home user={this.state.user} {...props}/>}/>
                  <Route exact path="/home" render={(props)=><Home user={this.state.user} {...props}/>}/>
                  <Route path="/list_users" render={(props)=><Users user={this.state.user} {...props}/>}/>
                  <Route path="/user:username" render={(props)=><User user={this.state.user} {...props}/>}/>
                  <Route path="/edit:username" render={(props)=><Edit user={this.state.user} {...props}/>}/>
                  <Route path="/settings:username" render={(props)=><Settings user={this.state.user} {...props}/>}/>
                  <Route path="/game:id" render={(props)=><RenderGamePage user={this.state.user} {...props}/>}/>
                  <Route path="/tgame:id" render={(props)=><RenderTeamGamePage user={this.state.user} {...props}/>}/>
                  <Route path="/map" render={(props)=><Map user={this.state.user} {...props}/>}/>
                  <Route path="/teams" render={(props)=><TeamPage user={this.state.user} {...props}/>}/>
                  <Route path="/teamgames" render={(props)=><CurrentTeamGames user={this.state.user} {...props}/>}/>
                  <Route path="/signin" render={(props)=><SignIn user={this.state.user} {...props}/>}/>
                  <Route path="/signup" render={(props)=><SignUpWrap user={this.state.user} {...props}/>}/>
                  <Route path="/logout" render={(props)=><LogOut user={this.state.user} {...props}/>}/>
                  <Route path="/Loading" render={(props)=><Loading user={this.state.user} {...props}/>}/>
                  <Route path="/_404" render={(props)=><_404 user={this.state.user} {...props}/>}/>
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
				          <Route path="/signup" component={SignUpWrap}/>
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

class SignUpWrap extends React.Component{
  render(){
    return(
      <div>
        <NavBar user={this.props.user}/>
        <SignUp user={this.props.user} history={this.props.history}/>
      </div>
    )
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
    this.loading=true;
    console.log("constructed");
    axios({
      method:"post",
      url:"/isuser",
      data:{
        "user":this.usrnm
      }
    })
    .then((isUser)=>{
      console.log("isuser?",isUser.data)
      this.isValidUser=isUser.data;
      this.loading=false;
      this.forceUpdate();
    })
	}
	componentWillMount(){

	}
  componentWillReceiveProps(props){
    this.forceUpdate();
    console.log(props);
    var usrnm=props.match.params.username;
     while(!(/[a-z]/i.test(usrnm[0]))){
       usrnm=usrnm.substring(1,usrnm.length);
     }
    this.usrnm=usrnm;
    this.forceUpdate();
      /*if(!(localStorage.getItem("loggedin")=="true")){
  			alert("Must be logged in to find users")
  			this.props.history.push("/signin");
  		}*/
      axios({
        method:"post",
        url:"/isuser",
        data:{
          "user":this.usrnm
        }
      })
      .then((isUser)=>{
        console.log("isuser?",isUser.data)
        this.isValidUser=isUser.data;
        this.loading=false;
        this.forceUpdate();
      })
  }
	render(){
		if(this.props.user==this.usrnm)
		{
			return(
				<div>
				<NavBar user={this.props.user}/>
				<ProfileP
					username={this.usrnm}
					history={this.props.history}
          user={this.props.user}
				/>
				</div>
		)}
    else if(this.isValidUser==true){
  			return(
  				<div>
  				<NavBar user={this.props.user}/>
  				<Profile
  					username={this.usrnm}
  					history={this.props.history}
            user={this.props.user}
  				/>
  				</div>
  		)}
    else if(this.loading==true){
      return(<Loading/>);
    }
		else{
      console.log(this.isValidUser);
			return(<_404/>);
		}
	};
};
class Edit extends React.Component{
  constructor(props){
    super(props);
  }
	render(){
		var usrnm=this.props.match.params.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}
		if(this.props.user==usrnm)
		{
			return(
        <div>
          <NavBar user={this.props.user}/>
          <div className = "editPage">
            <ProfileEdit
              username={usrnm}
              history={this.props.history}
              user={this.props.user}
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
  constructor(props){
    super(props);
  }
	render(){
		var usrnm=this.props.match.params.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}
		if(this.props.user==usrnm)
		{
			return(
				<div>
					<NavBar user={this.props.user}/>
					<ProfileSettings
						username={usrnm}
						history={this.props.history}
            user={this.props.user}
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
    console.log(this.id);
    while(!(/[0-9]|[a-z]/i.test(this.id[0]))){
			this.id=this.id.substring(1,this.id.length);
		}
    this.isGame=false;
    this.loading=true;
  }
  componentWillMount(){
    console.log("hello")
    axios({
      method:"post",
      url:"/isgame",
      data:{
        id:this.id
      }
    }).then((isGame)=>{
      this.isGame=isGame.data;
      this.loading=false;
      this.forceUpdate();
    })
  }
  render(){
    console.log("gametrue",this.isGame);
    if(this.isGame==true){

      return(<GamePage id={this.id} user={this.props.user}/>)
    }
    else if(this.loading==true){
      return(<Loading/>)
    }
    else{
      return(<_404/>);
    }
  }
}
class RenderTeamGamePage extends React.Component{
  constructor(props){
    super(props);
    this.id=this.props.match.params.id;
    console.log(this.id);
    while(!(/[0-9]|[a-z]/i.test(this.id[0]))){
			this.id=this.id.substring(1,this.id.length);
		}
    this.isGame=false;
    this.loading=true;
  }
  componentWillMount(){
    axios({
      method:"post",
      url:"/isgamet",
      data:{
        id:this.id
      }
    }).then((isGame)=>{
      this.isGame=isGame.data;
      this.loading=false;
      this.forceUpdate();
    })
  }
  render(){
    console.log("gametrue",this.isGame);
    if(this.isGame==true){

      return(<TeamGamePage id={this.id} user={this.props.user}/>)
    }
    else if(this.loading==true){
      return(<Loading/>)
    }
    else{
      return(<_404/>)
    }
  }
}

class LogOut extends React.Component{
  constructor(props){
    super(props);
    this.loading=true;
  }
	componentDidMount(){
    axios({
      url:"/logout-test",
      method:"delete",
      data:{
        key:localStorage.getItem("key")
      }
    }).then(()=>{
      //localStorage.setItem("key","");
      const cookies = new Cookies();
      cookies.set("key","",{path:"/"} );
      this.loading=false;

      this.props.history.push("/signin");
      location.reload(false);
    })

	}
	render(){
    if(this.loading==true){
      return(<Loading/>)
    }
    else{return(<_404 />);}
	}
}
const _404=()=>(
	<h1>404</h1>
);
const Loading=()=>(
	<img src={loadImg} />
);


module.exports={
	Routes,
	_404
}
