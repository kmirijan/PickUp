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
                    <Route exact path='/user' component={User} />
                    <Route component={_404} />
                </Switch>
            </BrowserRouter>
        )
    }
}

const Home=()=>(
	<div>
		<Top />
		<Rest />
	</div>
);
const User=()=>(
	<div>
		<Top />
		<Profile />
		<Feed />
	</div>
);
const _404=()=>(
	<h1>404</h1>
);

module.exports={
	Routes
}

