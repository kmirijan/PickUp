import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';
import NavBar from './NavBar';
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');
var axios=require("axios");
import SignUp from "./SignUp.jsx";
import CountUp from "react-countup";
import Welcome from "./Welcome.jsx";
import Login from "../helpers/login.js";


Login.verify(localStorage.getItem("key"),(res)=>{
  console.log("user",res);
})


class Home extends React.Component {
  constructor(props){
    super(props);
    this.state={
      usersCount:0,
      gamesCount:0
    }
    this.scroll=this.scroll.bind(this);
  }
  componentDidMount(){
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
  scroll(){
    /*if(window.pageYOffset>=100){
      window.scrollBy(0,100);
      if(window.pageYOffset>=1000){
        window.scrollBy(0,0);
      }
    }*/
  }
  render() {
    return (
      <div className="home">
        <NavBar/>
          <div className="first">

            <div className='centerText'>
              <h1 className='HomepageText'>Scroll Down to Discover, Connect, Play</h1>
              <p>PickUp is the easiest way to find members in your community interested in the same sports as you!</p>
            </div>
          </div>
          <div className="second">
            <div className="secondHeader">
              The most popular platform for sports fans
            </div>
            <StartCount usersCount={this.state.usersCount} gamesCount={this.state.gamesCount}/>
          </div>
          <div className="third">
            <SignUpHome/>
          </div>
      </div>
    );
  }
}
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
  }
  componentWillReceiveProps(newprops){
    this.setState(newprops);
  }
  displayCounts(){
    if(window.pageYOffset>=700){{
      this.setState({
        displayUsersCount:this.state.usersCount,
        displayGamesCount:this.state.gamesCount
      })
    }
  }
}
  componentDidMount(){
     window.addEventListener('scroll',this.displayCounts);
  }
  render(){
    return(
      <div className="startCount">
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
    if(localStorage.getItem("loggedin")=="true"){
      return(
        <div>
          <div className="thirdHeader">
            Welcome
          </div>
        <div className="signUpHome">
          <Welcome/>
        </div>
        </div>
      );
    }else {
      return(
        <div>
          <div className="thirdHeader">
            Sign Up Now
          </div>
          <div className="signUpHome">
            <SignUp/>
          </div>
        </div>
      );
    }
  }
}
export default Home;
