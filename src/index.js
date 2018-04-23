var React=require("react");
var ReactDOM=require("react-dom");

var {Main,Rest}=require("./components/main.jsx");

const title = 'My Minimal React Webpack Babel Setup';

class Everything extends React.Component{
	render(){
		return(
			<div>
				<Main />
				<Rest />
			</div>
			);
	}
}; 
ReactDOM.render(
  <Everything />,
  document.getElementById("body")
);


