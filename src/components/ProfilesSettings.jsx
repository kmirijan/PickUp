var React=require("react");
var ReactDOM=require("react-dom");
require("../css/profiles.css");
var {Switch,BrowserRouter,Route,browserHistory,Redirect}=require('react-router-dom');
var axios=require("axios");


class ProfileSettings extends React.Component{
	constructor(props){
		super(props);
		console.log("USER",this.props.user);
    this.changeEmail=this.changeEmail.bind(this);
    this.state={
      emailError:"",
      newEmail:"",
    }
	}

  changeEmail(newemail){
    //this.refs.changeEmailButton.setAttribute("disabled","disabled");
    if(newemail.match(/.*@.*/)==null){
      this.setState({emailError:"invalid email"})
    }
    else{
      axios({
        method:"post",
        url:"/setemail",
        data:{
          user:this.props.user,
          email:newemail
        }
      }).then((res)=>{
        this.setState({
          emailError:res.data,
          emailPrompt:[],
          newEmail:""
        })

        //this.refs.changeEmailButton.removeAttribute("disabled");
      })
    }
  }

	render(){
		return(
			<div id="profile">

				<div id="emailprompt" key="emailprompt">
					<input
						id="setemail"
						onChange={event => this.setState({newEmail: event.target.value})}>
					</input>
					<button
						type="button" className="btn btn-primary"
						key="changeEmailButton"
						onClick={()=>this.changeEmail(this.state.newEmail)}>
						save
					</button>
				</div>

			</div>
			);
	}
};



module.exports={
	ProfileSettings,
}
