import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';
import NavBar from './NavBar';
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');
var axios=require("axios");
import SignUp from "./SignUp.jsx";
import CountUp from "react-countup";
import Welcome from "./Welcome.jsx";

const NAVBARHEIGHT=50;
class Home extends React.Component {
  constructor(props){
    super(props);
    console.log("USER",this.props.user);
    this.state={
      usersCount:0,
      gamesCount:0
    }
    this.height=window.innerHeight-NAVBARHEIGHT;
    this.scroll=this.scroll.bind(this);
  }
  componentDidMount(){
    //deprecated
    window.addEventListener('scroll',this.scroll);
    axios({
      url:"/get-players-and-games-count",
      method:"post"
    }).then((res)=>{
      console.log(res.data);
      this.setState({
        usersCount:res.data.users,
        gamesCount:res.data.games
      })
    })
  }

  //deprecated
  scroll(){
    /*if(window.pageYOffset<this.height){
      this.refs.second.scrollIntoView();
    }
    else if(window.pageYOffset<this.height*2){
      this.refs.third.scrollIntoView();
    }
    else{}*/
  }
  render() {
    var height=window.innerHeight-NAVBARHEIGHT;
    return (
      <div className="home" ref="home">
        <NavBar user={this.props.user}/>
          <div className="first" ref="first" style={{height:height}}>

            <div className='centerText' ref="centerText">
              <h1 className='HomepageText' ref="HomepageText" style={{height:height/2}}>Scroll Down to Discover, Connect, Play</h1>
              <p>PickUp is the easiest way to find members in your community interested in the same sports as you!</p>
            </div>
          </div>
          <div className="second" ref="second" style={{height:height}}>
            <div className="secondHeader" ref="secondHeader" style={{height:height/2}}>
              The most popular platform for sports fans
            </div>
            <StartCount usersCount={this.state.usersCount} gamesCount={this.state.gamesCount}/>
          </div>
          <div className="third" ref="third" style={{height:height}}>
            <SignUpHome user={this.props.user} history={this.props.history}/>
          </div>
      </div>
    );
  }
}

//not working right now
class StartCount extends React.Component{

  constructor(props){
    super(props);
    this.state={
      usersCount:0,
      gamesCount:0,
      displayUsersCount:0,
      displayGamesCount:0
    }
    this.displayCounts=this.displayCounts.bind(this);
    this.height=window.innerHeight-NAVBARHEIGHT;
    this.ismounted = false;
  }

  componentDidMount(){
    this.ismounted = true;
  }

  componentWillReceiveProps(newprops){
      this.setState(newprops);
  }
  //checks page location and display count when scrolled to, set state
  displayCounts(){
    console.log("users count",this.state.usersCount)
    if(window.pageYOffset>=this.height){{
      this.setState({
        displayUsersCount:this.state.usersCount,
        displayGamesCount:this.state.gamesCount
      })
    }}
  }

  componentDidMount(){
     window.addEventListener('scroll',this.displayCounts);
  }

  render(){
    var height=window.innerHeight-NAVBARHEIGHT;
    return(
      <div className="startCount" style={{height:height/2}}>
        <div className="usersCount">
          <CountUp className="count" start={0} end={this.state.displayUsersCount}/>
          <h1 className="title">Users Playing</h1>
        </div>
        <div className="gamesCount">
          <CountUp className="count" start={0} end={this.state.displayGamesCount}/>
          <h1 className="title">Games Made</h1>
        </div>
      </div>
    )
  }
}

class SignUpHome extends React.Component{
  render(){
    var height=window.innerHeight-NAVBARHEIGHT;
    if(this.props.user!=null){
      return(
        <div >
          <div className="thirdHeader" style={{height:height/2}}>
            Welcome
          </div>
        <div className="signUpHome">
          <Welcome user={this.props.user}/>
        </div>
        </div>
      );
    }else {
      return(
        <div>
          <div className="thirdHeader" style={{height:height/2}}>
            Sign Up Now
          </div>
          <div className="signUpHome">
            <SignUp history={this.props.history}/>
          </div>
        </div>
      );
    }
  }
}
export default Home;
