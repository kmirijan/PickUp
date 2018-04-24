var React=require("react");
var ReactDOM=require("react-dom");


import("../css/main.css");
/*
var script=()=>{ 
		return {__html: '<script type="text/javascript src="./test.js"></script>'}; 
	};*/
class Main extends React.Component{
	render(){
		return(
			<div id="top">TOP BANNER</div>
		);
	}
}
class Rest extends React.Component{
	/*
	componentDidMount () {
        const script = document.createElement("script");

        script.src = "./test.js";
        script.async = true;

        document.body.appendChild(script);
    }*/
	render(){
		return(
			<div id="main">
				<div id="panel">
					<div id="banner">
						<h1 id="head1">PICKUP</h1>
					</div>
					<div id="page">
						<h2>Select game and location:</h2>
						<form id="form" action="/search" method="post" name="myform">
							Game:
							<input 
								id="event" 
								type="text" 
								name="event" 
								value={this.props.searchString} 
								placeholder="Enter a game"
							></input>
							Location:
							<input 
								id="location" 
								type="text" 
								name="location" 
								value={this.props.searchString}
								placeholder="Enter a location"
							></input>
							<button type="submit" id="submit" name="submit">
								 <img src="http://www.stickpng.com/assets/images/585e4ae1cb11b227491c3393.png" width="20" height="20" alt="submit" />
							</button>
						</form>
					</div>
	    			<div id="map"></div>

    			</div>
			</div>
		);
	}
}

module.exports={
	Main,
	Rest
}




