var React=require("react");
var ReactDOM=require("react-dom");
var {Top,Rest}=require("./Main.jsx");
require("../css/profiles.css");

class Profile extends React.Component{
	constructor(props){
		super(props);
		this.expandBio=this.expandBio.bind(this);
		this.state={
			expname:"expand",
			expanded:false,
			pic:"https://images.yswcdn.com/546017470459747400-ql-85/200/200/ay/blaircandy/basketball-candy-42.jpg",
			short:`This is a long paragraph.`,
			long:`This is a long paragraph. 
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.
				This is a long paragraph.`,
			username:"helloworld",
			alias:"Hello World"
		}
	}
	expandBio(){
		if(this.state.expanded==false){
			this.setState({expanded:true});
			this.setState({expname:"collapse"});
		}
		else{
			this.setState({expanded:false});
			this.setState({expname:"expand"});
		}
	}
	componentDidUpdate(prevProps,prevState){
		if(this.state.expanded==true && this.state.expanded!=prevState.expanded)
			this.refs.bio.innerHTML=this.state.long;
		if(this.state.expanded==false && this.state.expanded!=prevState.expanded)
			this.refs.bio.innerHTML=this.state.short;

	}
	render(){
		return(
			<div id="profile">
				<div id="panel">
					<div id="picture">
						<img src={this.state.pic}></img>
						<div id="mask"></div>
						<p id="changeimg">change picture</p>
					</div>
					<div id="username">
						{this.state.username}
					</div>
					<div id="alias">
						{this.state.alias}
					</div>
					<div id="bio" ref="bio">
						{this.state.short}
					</div>
					<div id="expand">
						<button onClick={this.expandBio}>
							{this.state.expname}
						</button>
					</div>
				</div>
			</div>
			);
	}
};


class Feed extends React.Component{
	render(){
		return(
			<div id="feed">
				<div id="fpanel">
					<h1>FEED</h1>
				</div>
			</div>
			);
	};
};
module.exports={
	Profile,
	Feed
}