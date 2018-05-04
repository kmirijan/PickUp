var React=require("react");
var ReactDOM=require("react-dom");
var {Top,Rest}=require("./Main.jsx");
var {Profile}=require("./Profiles.jsx");
var {ProfileP}=require("./ProfilesP.jsx");
var {ProfileEdit}=require("./ProfilesEdit.jsx");
var {CurrentGames}=require("./CurrentGames.jsx");
var {Users}=require("../helpers/Users.jsx");
import NavBar from './NavBar';
import SignUp from './SignUp';
import SignIn from './SignIn';
import App from "./App";
import Home from "./Home";
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');


class Routes extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Switch>
                	<Route exact path="/" component={NavBar} />
                	<Route exact path="/home" component={Home} />
                    <Route path="/users" component={Users} />
                    <Route path='/user:username' component={User}/>
                    <Route path="/edit:username" component={Edit}/>
                    <Route path="/app" component={App}/>
                    <Route path="/signin" component={SignIn}/>
					<Route path="/signup" component={SignUp}/>
					<Route path="/logout" component={LogOut}/>
                    <Route component={_404} />            
                </Switch>
            </BrowserRouter>
        )
    }
}


const Map=()=>(
	<div>
		<NavBar />
		<Rest />
	</div>
);
class User extends React.Component{
	constructor(props){
		super(props);
	}
	componentWillMount(){
		if(!(localStorage.getItem("loggedin")=="true")){
			alert("Must be logged in to find users")
			this.props.history.push("/signin");
		}
	}
	render(){
		var usrnm=this.props.match.params.username;
		while(!(/[a-z]/i.test(usrnm[0]))){
			usrnm=usrnm.substring(1,usrnm.length);
		}
		
		if((localStorage.getItem("loggedin")=="true")&&(localStorage.getItem("user")==usrnm))
		{
			console.log("hello world");
			return(
				<div>
				<NavBar />
				<ProfileP 
					username={usrnm}
					history={this.props.history}
				/>
				</div>
		)}
		else if(localStorage.getItem("loggedin")=="true"){
			return(
				<div>
				<NavBar />
				<Profile
					username={usrnm}
					history={this.props.history}
				/>
				</div>
		)}
		else{
			return(<_404/>)
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
					<ProfileEdit 
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

