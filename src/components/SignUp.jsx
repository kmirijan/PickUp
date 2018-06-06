import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';
import NavBar from './NavBar';
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');
var axios=require("axios");


class SignUp extends React.Component{
  constructor(props){
    super(props);
    console.log("USER",this.props.user);
    this.signUp=this.signUp.bind(this);
    this.state={
      email:'',
      password:'',
      username:'',
      error: {
        message: ''
      }
    }
  }

signUp(e){
  e.preventDefault();
  //prevent button from being clicked multiple times
  this.refs.signup.setAttribute("disabled","disabled");
  const{email, password, username}=this.state;
  this.refs.signup.setAttribute("disabled","disabled");
  /*http://codetheory.in/using-the-node-js-bcrypt-module-to-hash-and-safely-store-passwords/*/
  //check for email format matching
  if(email.match(/.*@.*/)==null){
    this.refs.signup.removeAttribute("disabled");
    this.setState({
      error:{
        message:"invalid email"
      }
    })
    this.refs.signup.removeAttribute("disabled");
  }//password length must be at least 8
  else if(password.length<8){
    this.refs.signup.removeAttribute("disabled");
    this.setState({
      error:{
        message:"password must be at least 8 characters long"
      }
    })
    this.refs.signup.removeAttribute("disabled");
  }
  else if(username[0].match(/[a-z]/i)==null){
    this.refs.signup.removeAttribute("disabled");
    this.setState({
      error:{
        message:"username must begin with a letter"
      }
    })
    this.refs.signup.removeAttribute("disabled");
  }
  else{
    axios({
        url:"/signup",
        method:"post",
        data:{
          "username":username,
          "email":email,
          "password":password,
          "alias": username,
          "bio":"",
          "pic":"/profilepictures/0default.png",
          "games":[],
          "teamgames":[],
          "teams":[],
          "friends":[],
          "feed":[]
        }
      }).then((res)=>{
        if(res.data==true){
          console.log("signed up");
          this.props.history.push("/signin");
        }
        else{
          this.setState({
            error:{
              message:res.data
            }
          })
        }

      });

  }
}

  render(){
    return(
    <div>
        <form
          className="form-inline"
          style={{margin: '5%'}}
          onSubmit={(e)=>this.signUp(e)}
          >
        <h2>SignUp</h2>
        <div className="form-group">
        <input
        className="form-control"
        type="text"
        style={{marginRight:'5px'}}
        placeholder="email"
        onChange={event => this.setState({email: event.target.value})}
        />
        <input
        className="form-control"
        type="password"
        style={{marginRight:'5px'}}
        placeholder="password"
        onChange={event => this.setState({password: event.target.value})}
        />
        <input
        className="form-control"
        type="text"
        style={{marginRight:'5px'}}
        placeholder="username"
        onChange={event => this.setState({username: event.target.value})}
        />
        <button
        ref="signup"
        className="btn btn-primary"
        type="submit"
        >
        Sign Up
        </button>
      </div>
      <div>{this.state.error.message}</div>
      <div><Link to={'/signin'}>Already a user? Sign in instead</Link></div>
    </form>
  </div>
    );
  }
}

export default SignUp;
