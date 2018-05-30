import React from 'react';
import {Link} from 'react-router-dom';
import '../css/App.css';
import NavBar from './NavBar';
var {Switch,BrowserRouter,Route,browserHistory}=require('react-router-dom');
var axios=require("axios");
import Cookies from 'universal-cookie';

class SignIn extends React.Component{
  constructor(props){
    super(props);
    console.log("USER",this.props.user);
    this.signIn=this.signIn.bind(this);
    this.state={
      email:'',
      password:'',
      error: {
        message: ''
      }
    }
  }

signIn(e){
  e.preventDefault();
  //this.refs.signin.setAttribute("disabled","disabled");
  console.log('this.state', this.state);


  const{email, password}=this.state;
   axios({
      url:"/signin-test",
      method:"post",
      data:{
        "email":email,
        "password":password
      }
    }).then((res)=>{
      if(res.data["success"]==true){
        //https://www.robinwieruch.de/local-storage-react/
        //localStorage.setItem("key",res.data["key"]);
        const cookies = new Cookies();
        cookies.set("key",res.data["key"],{path:"/"});
        console.log("mykey",cookies.get("key"))
        this.props.history.push("/user:"+res.data["user"]);
        location.reload(false);
      }
      else
      {
        console.log("sign in failed");
        this.setState({
          error:{
            message:"sign in failed"
          }
        })
        this.refs.signin.removeAttribute("disabled");
        this.props.history.push("/signin");
        location.reload(false);

      }
    });

}

  render(){
    return(
      <div>
        <NavBar user={this.props.user}/>
        <form
          className="form-inline"
          style={{margin: '5%'}}
          onSubmit={(e)=>this.signIn(e)}
          >
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
          type="submit"
          >
          Sign In
          </button>
        </div>
        <div>{this.state.error.message}</div>
        <div><Link to={'/signup'}>Sign up instead</Link></div>
      </form>
    </div>
    );
  }
}

export default SignIn;
