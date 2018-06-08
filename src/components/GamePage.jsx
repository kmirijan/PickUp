var React=require("react");
var ReactDOM=require("react-dom");
var axios=require("axios");
import NavBar from "./NavBar"
require("../css/gamePage.css")
//https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34
import io from 'socket.io-client';
var {Link}=require('react-router-dom');




class GamePage extends React.Component{
  constructor(props){
    super(props);
    console.log("USER",this.props.user);
    this.state={
      game:null
    }
    this.playersList=this.playersList.bind(this);

  }
  componentDidMount(){
    axios({
      method:"post",
      url:"/retrievespecificgames",
      data:{
        id:this.props.id
      }
    }).then((res)=>{
      this.setState({
        game:res.data[0]
      })
    })
  }
  playersList(){
    if(this.state.game==null){return}
    console.log("valid players list")
    players=this.state.game.players.map((player)=>{
      return(
        <li key={player}>
  				<Link to={"./user="+player}>{player}</Link>
  			</li>
      )
    })
    return(<ul key="players">{players}</ul>)
  }

  render(){
    console.log("render",this.state.game);
    return(
      <div>
        <NavBar user={this.props.user}/>
        <div id="entirePage">
          <div id="gamePage">
            <div id="players">
              <div>
                PLAYERS:
              </div>
              <div>
                {this.playersList()}
              </div>

            </div>
            <div id="location">
              LOCATION IN MAP
            </div>
            <div id="map">
              MAP NOT IMPLEMENTED
            </div>
          </div>
          <div id="chat">
            <Chat user={this.props.user} id={this.props.id}/>
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
      numberOfMessages:0, //not currently used
      myMessage:"",
      loading:true,
      mounted:false,
    }
    this.socket.on("message",(m)=>{
      console.log("got message")
      //only update messages by socket after they've all been fetched from db
      //to prevent duplicates in the case that a message is received
      //while in the middle of fetching all messages
      if(this.state.loading==false){
        let messages=this.state.messages.slice();
        messages.push(m);
        console.log(messages);
        this.setState({
          messages:messages
        },()=>{
          /*https://stackoverflow.com/questions/270612/scroll-to-bottom-of-div?utm
          _medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa*/
          let objDiv = document.getElementById("allMessages");
          objDiv.scrollTop = objDiv.scrollHeight;
        })
      }
    })
  }
  /*need to test whether messages will stay up to date if someone sends
  a messages and and someone refreshes the page in the middle of it, or if someone sends a message
  while the messages are still being fetched*/
  getAllMessages(){
    axios({
      url:"/get-chats",
      method:"post",
      data:{
        id:this.props.id
      }
    }).then((res)=>{
      this.setState({
        messages:res.data.messages,
        numberOfMessages:res.data.length,
        loading:false
      },()=>{

        let objDiv = document.getElementById("allMessages");
        objDiv.scrollTop = objDiv.scrollHeight;
      })

    })
  }
  componentDidMount(){
    this.setState({mounted:true})
  }
  componentWillReceiveProps(){
    if(this.state.mounted==true){
      this.getAllMessages();
    }

  }
  sendMessages(){
    this.socket.emit("send",{
      sender:this.props.user,
      message:this.state.myMessage,
      id:this.props.id
    })
    this.setState({myMessage:""})

  }
  sendMessageEnter(e){
    if(e.key=="Enter"){
      this.sendMessages();
    }
  }
  showMessages(){
    let messageCount=0;
    let messages=this.state.messages.map((message)=>{
      messageCount=messageCount+1;
      return(
        <div key={"message"+messageCount}>
          <div id="sender">
            {message["sender"]}
          </div>
          <div id="message">
            {message["message"]}
          </div>
          <div id="time">
            {message["time"]}
          </div>
        </div>
      )
    })
    return(<div id="messages" key={"messages"}>{messages}</div>)
  }
  render(){
    return(

      <div className="chat" id="chat">
        <div className="allMessages" id="allMessages">
          {this.showMessages()}
        </div>

        <div id="messageInput">
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

      </div>
    )
  }
}
module.exports={
  GamePage
}
