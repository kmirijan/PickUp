var React=require("react");
var ReactDOM=require("react-dom");
var {Top,Rest}=require("./Main.jsx");
var {Profile,Feed}=require("./Profiles.jsx");
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');


class Routes extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/user:username' component={User}/> 	
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
			<Profile username={this.props.match.params.username}/>
			<Feed />
		</div>
	)};
}
	
const _404=()=>(
	<h1>404</h1>
);

module.exports={
	Routes
}

