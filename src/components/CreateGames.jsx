import React from 'react';
import '../css/App.css';
var {Link}=require('react-router-dom');


import axios from 'axios';

const GUEST = "guest";

export class CurrentGames extends React.Component{



    constructor(props) {
        super(props);
        this.state = {
            game: {},
            isprivate:false
        };
        this.addGame = this.addGame.bind(this);
        this.togglePrivate=this.togglePrivate.bind(this);
    }
    componentDidMount() {
           let input = document.getElementById('location');
           this.autocomplete = new google.maps.places.Autocomplete(input);
    }




    getName()
    {
        if (this.props.user != GUEST)
        {
            return this.props.user;
        }
        else
        {
            return this.refs.name.value;
        }
    }

    getName()
    {
        if (this.props.user != GUEST)
        {
            return this.props.user;
        }
        else
        {
            return this.refs.name.value;
        }
    }

    addGame(event) {
        event.preventDefault();
        let sport = this.refs.sport.value;
        let name = this.getName();
        let location = this.refs.location.value;
        let isprivate = this.state.isprivate;
        let coords = this.autocomplete.getPlace().geometry.location;
        let id = Math.floor((Math.random()*(1 << 30))+1);
        let game = {
            gameId: id,
            sport: sport,
            name: name,
            isprivate:isprivate,
            location: location,
            user: this.props.user,
            coords: {
                lat: coords.lat(),
                lng: coords.lng()
            },
        };
        axios.post('/postgames', game).then( () =>
                {alert("Game added. It will appear upon refreshing the games table")});
        this.refs.sport.value='';
        this.refs.name.value='';
        this.refs.location.value='';
    }
    togglePrivate(){
      if(this.state.isprivate==false){
        this.setState({
          isprivate:true
        })
      }
      else{
        this.setState({
          isprivate:false
        });
      }
    }


    displayNameInput()
    {
        if (this.props.user != GUEST)
        {
            return null;
        }
        else
        {
            return (
                <input
                className='gameDetails'
                type="text"
                ref="name"
                placeholder="Name"
                />

            );
        }
    }

    render(){

        return(
            <div>


              <div className="container">
              			<div className="row main">
              				<div className="panel-heading">
              	               <div className="panel-title text-center">
              	               		<h1 className="title">Create a game below:</h1>
              	               		<hr />
              	               	</div>
              	            </div>
              				<div className="main-create main-center">
              					<form className="form-horizontal"
                          onSubmit={this.addGame.bind(this)}>
                          {this.displayNameInput()}

              						<div className="form-group">
              							<label className="cols-sm-2 control-label">Activity</label>
              							<div className="cols-sm-10">
              								<div className="input-group">
              									<span className="input-group-addon"></span>
              									<input className='gameDetails form-control' type="text"  type="text"
                                ref="sport"
                                placeholder="Activity"/>
              								</div>
              							</div>
              						</div>

                          <div className="form-group">
              							<label className="cols-sm-2 control-label">Location</label>
              							<div className="cols-sm-10">
              								<div className="input-group">
              									<span className="input-group-addon"></span>
              									<input className='gameDetails form-control' type="text"  type="text"
                                  id= 'location'
                                  ref="location"
                                  placeholder="Location"/>
              								</div>
              							</div>
              						</div>


                          <div className="form-group">
                            <p>Private</p>
                            <input
                              className='gameDetails'
                              id= 'isprivate'
                             type="checkbox"
                             ref="isprivate"
                             onChange={this.togglePrivate}/>
              						</div>

              						<div>
                            <input type="submit" className="btn btn-primary" value="Create"/>
            								<span></span>
            								<input type="reset" className="btn btn-default" value="Clear"/>
              						</div>
              					</form>
              				</div>
              			</div>
              		</div>



            </div>
        );

    }
}