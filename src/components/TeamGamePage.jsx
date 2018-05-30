var React=require("react");
var ReactDOM=require("react-dom");
var axios=require("axios");
import NavBar from "./NavBar"
require("../css/gamePage.css")
//https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34
import io from 'socket.io-client';
import MapIndiv from "./MapIndiv";



class TeamGamePage extends React.Component{
  constructor(props){
    super(props);
    console.log("USER",this.props.user);
    this.state={
      game:null
    }


  }
  componentWillMount(){
    axios({
      method:"post",
      url:"/retrievespecificgamesT",
      data:{
        id:this.props.id
      }
    }).then((res)=>{
      this.setState({
        game:res.data[0]
      })
    })
  }
  render(){
    console.log("render",this.state.game);
    return(
      <div>
        <NavBar user={this.props.user}/>
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
              <MapIndiv thisGame={this.state.game}/>
            </div>
          </div>
          <div id="chat">
            <Chat user={this.props.user}/>
          </div>
        </div>
      </div>
    )
  }
}
class Chat extends React.Component{
  constructor(props){
    super(props);
    this.sendMessages=this.sendMessages.bind(this);
    this.showMessages=this.showMessages.bind(this);
    this.sendMessageEnter=this.sendMessageEnter.bind(this);
    this.socket = io();
    this.state={
      messages:[],
      myMessage:""
    }
    this.socket.on("message",(m)=>{
      console.log("got message")
      let messages=this.state.messages.slice();
      messages.push(m);
      console.log(messages);
      this.setState({
        messages:messages
      })
    })
  }
  sendMessages(){
    this.socket.emit("send",{
      sender:this.props.user,
      message:this.state.myMessage
    })
    this.setState({myMessage:""})

  }
  sendMessageEnter(e){
    if(e.key=="Enter"){
      this.sendMessages();
    }
  }
  showMessages(){
    let messages=this.state.messages.map((message)=>{
      return(
        <div>
          <div>
            {message["sender"]}
          </div>
          <div>
            {message["message"]}
          </div>
          <div>
            {message["time"]}
          </div>
        </div>
      )
    })
    return(<div key="messages">{messages}</div>)
  }
  render(){
    return(
      <div className="chat">
        <div className="messages">
          {this.showMessages()}
        </div>
        <input type="text"
          ref="inputMessage"
          value={this.state.myMessage}
          onChange={(e)=>this.setState({myMessage:e.target.value})}
          onKeyPress={(e)=>{this.sendMessageEnter(e)}}
          >
        </input>
        <button onClick={this.sendMessages}>
          Send
        </button>
      </div>
    )
  }
}
module.exports={
  TeamGamePage
}
