import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';
import NavBar from './NavBar';
var axios=require("axios");


class SignUp extends React.Component{
  constructor(props){
    super(props);
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
  console.log('this.state', this.state);
  const{email, password, username}=this.state;
  /*http://codetheory.in/using-the-node-js-bcrypt-module-to-hash-and-safely-store-passwords/*/
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
        "games":[]
      }
    }).then(()=>{
      console.log("signed up");
      this.props.history.push("/");
    });
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