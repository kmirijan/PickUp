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
                    <Route component={NotFound} />
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
const NotFound=()=>(
	<h1>404.. This page is not found!</h1>
);

module.exports={
	Routes
}

