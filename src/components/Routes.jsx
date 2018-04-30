var React=require("react");
var ReactDOM=require("react-dom");
var {Top,Rest}=require("./Main.jsx");
var {Profile,Feed}=require("./Profiles.jsx");
var {ProfileP,FeedP}=require("./ProfilesP.jsx");
var {ProfileEdit}=require("./ProfilesEdit.jsx");
var {CurrentGames}=require("./CurrentGames.js");
import NavBar from './NavBar';
import SignUp from './SignUp';
import SignIn from './SignIn';
import App from "./App";
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');


class Routes extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Switch>
                	<Route exact path="/" component={NavBar} />
                    <Route exact path='/map' component={Map} />
                    <Route path='/user:username' component={User}/>
                    <Route path="/edit:username" component={Edit}/>
                    <Route path="/games" component={CurrentGames}/>
                    <Route path="/signin" component={SignIn}/>
					<Route path="/signup" component={SignUp}/>
                    <Route component={_404} />            
                </Switch>
            </BrowserRouter>
        )
    }
}
/*
<Route path="/:id" render={({match}) => 
<RunningProject getProjectById={this.getProject} match={match} />} />
*/

const Map=()=>(
	<div>
		<Rest />
	</div>
);
class User extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div>
			<ProfileP 
				username={this.props.match.params.username}
				history={this.props.history}
			/>
			<FeedP />
		</div>
	)};
};
class Edit extends React.Component{
	render(){
		return(
			<div>
				<ProfileEdit 
					username={this.props.match.params.username}
					history={this.props.history}
				/>
			</div>
		)
	}
}
	
const _404=()=>(
	<h1>404</h1>
);

module.exports={
	Routes
}

