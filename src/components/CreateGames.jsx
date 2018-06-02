import React from 'react';
import InputField from '../helpers/InputField';
import '../css/App.css';


import axios from 'axios';

const GUEST = "guest";

export class CreateGames extends React.Component{



    constructor(props) {
        super(props);
        console.log("USER",this.props.user);
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


    addGame(event) {
        event.preventDefault();
        let place = this.autocomplete.getPlace();
        if (place == undefined)
        {
            this.refs.location.setError("Please select a location from the dropdown menu");
            return;
        }
        let coords = place.geometry.location;

        let id = Math.floor((Math.random()*(1 << 30))+1);
        let startTime = (new Date()).getTime();
        let gameLength = parseFloat(this.refs.gameLength.getInput()) * 60*60*1000; // expected length of game in milliseconds
        let game = {
            id: id,
            sport: this.refs.sport.getInput(),
            name: this.props.user,
            isprivate: this.state.isprivate,
            location: this.refs.location.getInput(),
            user: this.props.user,
            lat: coords.lat(),
            lng: coords.lng(),
            startTime: startTime,
            gameLength: gameLength,
        };

        if (this.gameValidate(game) == true)
        {
            $('#createSoloGames').collapse('hide');
            console.log(game);
            axios.post('/postgames', game)
            axios.patch('/user:game', {uid: this.props.user, gid: game.id}).then( () => {
                    console.log("Game Created in create Games");
                    if (this.props.onNewGame != undefined)
                    {
                        console.log("Running updates from CreateGames");
                        this.props.onNewGame();
                    }
            });
            this.refs.sport.clear();
            this.refs.location.clear();
            this.refs.gameLength.clear();
        }
        else
        {
            this.displayInputErrors(game);
        }
    }
    gameValidate(game)
    {
        let isValid = true;
        if (game.sport.trim() == "")
        {
            isValid = false;
        }
        if ( isNaN(game.gameLength) || game.gameLength < 0 )
        {
            isValid = false;
        }
        return isValid;
    }
    displayInputErrors(game)
    {
        if (game.sport.trim() == "")
        {
            this.refs.sport.setError("Please give a non-empty name");
        }
        if ( isNaN(game.gameLength) || game.gameLength < 0 )
        {
            this.refs.gameLength.setError("Please input a non-negative number");
        }
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


    render(){

        return(
            <div>


              <div className="container">
              			<div className="row main">
              				<div className="panel-heading">
              	               <div className="panel-title text-center">
              	               		<h1 className="collapseTitle">Create a game below:</h1>
                                  <hr />
              	               	</div>
              	            </div>
              				<div className="main-create main-center">
              					<form className="form-horizontal"
                          onSubmit={this.addGame.bind(this)}>


                          <InputField label="Activity" type = "text" 
                                ref="sport" placeholder="Activity" />
                          <InputField label="Location" ref="location" type="text"
                                id='location' placeholder="Location" />
                          <InputField label="Game Length(Hours)" 
                                ref="gameLength" placeholder="hours"
                                type="number" min="0" />

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
