var React=require("react");
var ReactDOM=require("react-dom");

var {Top,Rest}=require("./components/Main.jsx");
var {Routes}=require("./components/Routes.jsx");
const title = 'My Minimal React Webpack Babel Setup';




class Everything extends React.Component{
	render(){
		return(
			<div>
				<Routes />
			</div>

			);
	}
}; 

ReactDOM.render(
  <Everything />,
  document.getElementById("body")
);