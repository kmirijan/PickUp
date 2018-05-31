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
    console.log("Props on create\n",this.props);
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
        this.props.updateUser(); // update the user value in Routes
        console.log("mykey",cookies.get("key"))
      //  location.reload(false);
        this.props.history.push("/user:"+res.data["user"]);
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
          onSubmit={this.signIn.bind(this)}
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
