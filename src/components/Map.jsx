import React from 'react';
import NavBar from './NavBar';
import axios from "axios"
import {GameTable, Game} from './CurrentGames';
import {CurrentGames} from './CreateGames';



class Map extends React.Component {
    DEFAULT_ZOOM = 13;
    constructor(props)
    {
        super(props);
        this.state = {
            userPosition : {lat: 37.758, lng: -122.473}, // San Francisco as default
            map : {},
            games : [],
            nearbyGames: [],
            range : 5, /* miles away from location */

        };

        this.setUserPosition = this.setUserPosition.bind(this);
        this.markers = [];
    }


    componentWillMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setUserPosition);
        }

    }

    componentDidMount()
    {

        if (navigator.geolocation)
        {
            // create a google map centered at the user's location

            let center = new google.maps.LatLng(this.state.userPosition.lat,
                    this.state.userPosition.lng);
            this.setState({map : new google.maps.Map(this.refs.map,
                            {center: center, zoom: this.DEFAULT_ZOOM})

            });
        }




    }

    setUserPosition(position) {
        this.setState({userPosition : {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            }
        });

        if (this.state.map != {})
        {
            let center = new google.maps.LatLng(this.state.userPosition.lat,
                    this.state.userPosition.lng);
            this.state.map.panTo(center);
        }

        // get nearby games
        this.retrieveNearbyGames();
    }


    MILES_PER_DEGREE = 69;
    retrieveNearbyGames() {
        let range = {
            lat: this.state.range / this.MILES_PER_DEGREE,
            lng: Math.cos(this.state.userPosition.lat) * this.state.range / this.MILES_PER_DEGREE
        };

        axios.post("/nearbygames", {range: range, center: this.state.userPosition}).then(
            (results) => {
                this.setState({nearbyGames : results.data});
                this.updateMap();
            }
        );

    }

    updateMap() {
        console.log("adding markers");
        console.log(this.state.nearbyGames);
        this.state.nearbyGames.map((game) =>
        {
            console.log(game);
            // add games as markers
            let position = new google.maps.LatLng(game.coords.lat, game.coords.lng);

            var marker = new google.maps.Marker({position:position, title:game.sport});
            let content = this.createInfoWindowContent(game);
            var infoWindow = new google.maps.InfoWindow({
                content: content
            });
            this.markers.push(marker);
            marker.setMap(this.state.map);
            marker.addListener('click', () => {infoWindow.open(this.state.map, marker)});
            console.log("Marker added");
        });
    }

    createInfoWindowContent(game)
    {
        return (
            '<div id="content">' +
                '<div id="siteNotice" />' +
                '<h1 id="firstHeading" class="firstHeading">' + game.sport + '</h1>' +
                '<div id="bodyContent">' +
                    '<div>Name: ' + game.name + '</div>' +
                    '<div>Location: ' + game.location + '</div>' +
                '</div>' +
            '</div>'

        );


    }

    render() {

    if (navigator.geolocation)
    {
    return (
        <div>
            <NavBar/>


              <div className="container">
                <button type="button" className="btn btn-primary" data-toggle="collapse"
                  data-target="#createSoloGames">Create A Team Game</button>
                <div id="createSoloGames" className="collapse">
                  <CurrentGames />
                  </div>
                </div>

            <div className="Map">
                <h1>Games near you</h1>
                <div ref="map" style={{height: "500px", width: "30%", float: "left"}}></div>
                  <div className = "gameTableInMap">
                    <GameTable/>
                  </div>
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





export default Map;
