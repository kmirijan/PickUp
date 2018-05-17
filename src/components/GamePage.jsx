var React=require("react");
var ReactDOM=require("react-dom");
var axios=require("axios");
import NavBar from "./NavBar"
require("../css/gamePage.css")

class GamePage extends React.Component{
  constructor(props){
    super(props);

  }
  componentWillMount(){

  }
  render(){
    return(
      <div>
        <NavBar/>
        <div id="entirePage">
          <div id="gamePage">
            <div id="players">
              players
            </div>
            <div id="teams">
              teams
            </div>
            <div id="location">
              location
            </div>
            <div id="map">
              map
            </div>
          </div>
          <div id="chat">
            chat
          </div>
        </div>
      </div>
    )
  }
}

module.exports={
  GamePage
}
