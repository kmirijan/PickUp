var React=require("react");
var ReactDOM=require("react-dom");
var axios=require("axios");
import NavBar from '../components/NavBar';
import {NavLink} from 'react-router-dom';
import '../css/App.css';

class Users extends React.Component{
	constructor(props){
		super(props);
		this.state={
			users:[],
			fliteredUsers:[]
		}
	}
	componentDidMount(){
		axios({
			url:"/getallusers",
			method:"post",
		}).then((res)=>{
			this.setState({users:res.data});
		})
	}

	usersList(){
		const usersList=this.state.users.map((user)=>
			<li key={user}>
				<NavLink to={"./user="+user}>
					{user}
				</NavLink>
			</li>
		)
		return(
			<ul className="w3-ul w3-card" key="usersList">{usersList}</ul>
		)
	}

	updateSearch(event){
		this.updateUsers(event.target.value);
	}

	updateUsers(search) {
			this.setState({filteredUsers : this.state.users.filter(
					(user) => { return ((users.user.toLowerCase().indexOf(search.toLowerCase()) !== -1))
					})
				});
	}

	render(){
		return(
			<div>
				<NavBar user={this.props.user}/>
				<h2>Users list:</h2>
				<div>
          <input className="w3-input w3-border w3-round"
						type="text"
            placeholder="Search"
						ref="search"
						onChange={this.updateSearch.bind(this)}/>
				</div>
				<div>
					{this.usersList()}
				</div>
			</div>
		)
	}
}
module.exports={
	Users
}
