var React=require("react");
var ReactDOM=require("react-dom");
var {Top,Rest}=require("./Main.jsx");

class ProfileP extends React.Component{
	render(){
		return(
			<div id="profile">
				<div id="picture">
				</div>
				<div id="username">
				</div>
				<div id="alias">
				</div>
				<div id="bio">
				</div>
			</div>
			);
	};
};
class FeedP extends React.Component{
	render(){
		return(
			<div id="feed">
			</div>
			);
	};
};