import React from 'react';
import NavBar from './NavBar';
import axios from "axios"
//import '../css/Map.css';



class MapIndiv extends React.Component {
    DEFAULT_ZOOM = 13;
    constructor(props)
    {
        super(props);
        this.state = {
            userPosition : {lat: 37.758, lng: -122.473}, // San Francisco as default
            map : {},
            thisGame:null,
            range : 5, /* miles away from location */
            users:[]

        };
        console.log("props",this.props)
        this.initMap=this.initMap.bind(this);
        this.setUserPosition=this.setUserPosition.bind(this);
    }
    componentWillMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setUserPosition);
        }
    }
    setUserPosition(position,fn){
      this.setState({
        userPosition : {
          lat: position.coords.latitude,
          lng: position.coords.longitude
          }
      })
    }

    initMap() {
        if(this.state.thisGame==null){
          console.log("thisGame is null")
          return;
        }
        var gameLocation = this.state.thisGame.coords;

        var map = new google.maps.Map(this.refs.map, {
          zoom: 4,
          center: gameLocation
        });

        var marker = new google.maps.Marker({
          position: gameLocation,
          map: map,
          title: this.state.thisGame.name
        });

        for(var i=0; i<this.state.users.length; i++){
          console.log("wonderful",this.state.users[i])
          var marker = new google.maps.Marker({
            position: this.state.users[i].location,
            map: map,
            title: this.state.users[i].name
          });
        }

    }
    componentDidUpdate(){
      this.initMap();
    }
    componentWillReceiveProps(nextProps){
      console.log("nextprops",nextProps.thisGame)
      this.setState({
        thisGame:nextProps.thisGame
      },()=>{
        console.log("updated",this.state.thisGame);
        this.initMap();
      })
    }

    render() {

    if (navigator.geolocation)
    {
    return (
        <div>
            <NavBar/>
            <div className="Map">
                <h1>Game location</h1>
                <div ref="map" style={{height: "100%", width: "100%"}}></div>
            </div>


        </div>);
    } else {
        return (
        <div>
            <NavBar/>
            <div className="Map">
                <h1>Location must be allowed to use this feature</h1>
            </div>
        </div>);
    }


    }

}





export default MapIndiv;
