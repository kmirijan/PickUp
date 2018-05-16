var React=require("react");
var ReactDOM=require("react-dom");
var axios=require("axios");
import NavBar from "./NavBar"

class GamePage extends React.Component{
  constructor(props){
    super(props)
  }
  //group chat
  //map
  //players
  render(){
    return(
      <div>
        <NavBar/>
        <h1>GAME ID: {this.props.id}</h1>
      </div>
    )
  }
}

module.exports={
  GamePage
}
