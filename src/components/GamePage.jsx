var React=require("react");
var ReactDOM=require("react-dom");
var axios=require("axios");

class GamePage extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return(<h1>GAME ID: {this.props.id}</h1>)
  }
}

module.exports={
  GamePage
}
