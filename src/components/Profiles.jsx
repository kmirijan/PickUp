var React=require("react");
var ReactDOM=require("react-dom");
var {Top,Rest}=require("./Main.jsx");
require("../css/profiles.css");

class Profile extends React.Component{
	render(){
		return(
			<div id="profile">
				<div id="panel">
					<div id="picture">
					</div>
					<div id="username">
						user12345
					</div>
					<div id="alias">
						USER 12345
					</div>
					<div id="bio">
						Hello world, this is a long paragraph. The longer the paragraph,
						the more space this will take.
						There will be a character limit feature, so that this isn't too long.
						Also, there will be a preview with an "expand" button to display 
						full graph, as below.
					</div>
					<div id="expand">
						<button>
							expand
						</button>
					</div>
				</div>
			</div>
			);
	};
};
class Feed extends React.Component{
	render(){
		return(
			<div id="feed">
				<div id="fpanel">
				</div>
			</div>
			);
	};
};
module.exports={
	Profile,
	Feed
}