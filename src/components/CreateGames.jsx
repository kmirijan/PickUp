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

    addGame(event) {
        event.preventDefault();
        let sport = this.refs.sport.getInput;
        let name = this.getName();
        let location = this.refs.location.getInput();
        let isprivate = this.state.isprivate;
        let coords = this.autocomplete.getPlace().geometry.location;
        let id = Math.floor((Math.random()*(1 << 30))+1);
        let startTime = (new Date()).getTime();
        let gameLength = this.refs.gameLength.getInput(); // expected length of game in milliseconds
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
            startTime: startTime,
            gameLength: gameLength,
        };
        axios.post('/postgames', game)
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
                                    

                                    <GameInputField label="Activity" ref="sport" placeholder="Activity" />
                                    <GameInputField label="Location" ref="location" id='location' placeholder="Location" />
              				        <GameInputField label="Game Length(Hours)" ref="gameLength" placeholder="Hours" />


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


class GameInputField extends React.Component {

    getInput()
    {
        return this.refs.input.value;
    }
    
    render()
    {
        <div className="form-group">
        	<label className="cols-sm-2 control-label">{this.props.label}</label>
                <div className="cols-sm-10">
        			<div className="input-group">
        				<span className="input-group-addon"></span>
          				<input className='gameDetails form-control' type="text"  type="text"
                                ref="input"
                                {...props}/>
        			</div>
            	</div>
        </div>
    }

}
