var React=require("react");
var ReactDOM=require("react-dom");
var {Top,Rest}=require("./Main.jsx");
var {Profile,Feed}=require("./Profiles.jsx");
var {ProfileP,FeedP}=require("./ProfilesP.jsx");
var {ProfileEdit}=require("./ProfilesEdit.jsx");
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');


class Routes extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/user:username' component={User}/>
                    <Route path="/edit:username" component={Edit}/>
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

const Home=()=>(
	<div>
		<Top />
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
			<Top />
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
				<Top />
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

