import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';
import NavBar from './NavBar';
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');
var axios=require("axios");


class SignUp extends React.Component{
  constructor(props){
    super(props);
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

signUp(){
  this.refs.signup.setAttribute("disabled","disabled");
  const{email, password, username}=this.state;
  this.refs.signup.setAttribute("disabled","disabled");
  /*http://codetheory.in/using-the-node-js-bcrypt-module-to-hash-and-safely-store-passwords/*/
  if(email.match(/.*@.*/)==null){
    this.refs.signup.removeAttribute("disabled");
    this.setState({
      error:{
        message:"invalid email"
      }
    })
    this.refs.signup.removeAttribute("disabled");
  }
  else if(password.length<8){
    this.refs.signup.removeAttribute("disabled");
    this.setState({
      error:{
        message:"password must be at least 8 characters long"
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
          "pic":"",
          "games":[],
          "friends":[],
          "feed":[]
        }
      }).then((res)=>{
        if(res.data==true){
          console.log("signed up");
          localStorage.setItem("loggedin",true);
          localStorage.setItem("user",this.state.username);
          this.props.history.push("/user="+this.state.username);
        }
        else{
          this.setState({
            error:{
              message:res.data
            }
          })
        }
        this.refs.signup.removeAttribute("disabled");
      });

  }
}

  render(){
    return(
    <div>
      <NavBar/>
        <div className="form-inline" style={{margin: '5%'}}>
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
        type="button"
        onClick={() => this.signUp()}
        >
        Sign Up
        </button>
      </div>
      <div>{this.state.error.message}</div>
      <div><Link to={'/signin'}>Already a user? Sign in instead</Link></div>
    </div>
  </div>
    );
  }
}

export default SignUp;
