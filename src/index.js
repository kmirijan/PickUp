var React=require("react");
var ReactDOM=require("react-dom");
var {Routes}=require("./components/Routes.jsx");
import NavBar from './components/NavBar';




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
