import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';
import NavBar from './NavBar';
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');
var axios=require("axios");

class SignIn extends React.Component{
  constructor(props){
    super(props);
    this.signIn=this.signIn.bind(this);
    this.state={
      email:'',
      password:'',
      error: {
        message: ''
      }
    }
  }

signIn(){
  this.refs.signin.setAttribute("disabled","disabled");
  console.log('this.state', this.state);
  const{email, password}=this.state;
   axios({
      url:"/signin",
      method:"post",
      data:{
        "email":email,
        "password":password
      }
    }).then((res)=>{
      if(res.data["success"]==true){
        /*https://www.robinwieruch.de/local-storage-react/*/
        localStorage.setItem("loggedin","true");
        localStorage.setItem("user",res.data["user"]);
        this.props.history.push("/user="+res.data["user"]);
      }
      else
      {
        console.log("sign in failed");
        this.setState({
          error:{
            message:"sign in failed"
          }
        })
        this.props.history.push("/signin");
      }
      console.log(localStorage.getItem("loggedin"))
      this.refs.signin.removeAttribute("disabled");
    });
}

  render(){
    return(
      <div>
        <NavBar/>
          <div className="form-inline" style={{margin: '5%'}}>
        <h2>SignIn</h2>
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
        <button
        ref="signin"
        className="btn btn-primary"
        type="button"
        onClick={() => this.signIn()}
        >
        Sign In
        </button>
      </div>
      <div>{this.state.error.message}</div>
      <div><Link to={'/signup'}>Sign up instead</Link></div>
    </div>
  </div>
    );
  }
}

export default SignIn;
