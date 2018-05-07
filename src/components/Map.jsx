import React from 'react';
import NavBar from './NavBar';
import axios from "axios"
//import '../css/Map.css';



class Map extends React.Component {
    DEFAULT_ZOOM = 13; 
    constructor(props)
    {
        super(props);
        this.state = {
            userPosition : {lat: 36.99147, lng: -122.06049}, // UCSC as default
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
        // create a google map centered at the user's location
        let center = new google.maps.LatLng(this.state.userPosition.lat,
                this.state.userPosition.lng);
        this.setState({map : new google.maps.Map(this.refs.map,
                            {center: center, zoom: this.DEFAULT_ZOOM})
        });





    }

    setUserPosition(position) {
        this.setState({userPosition : {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            }
        });

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
        
        for (game in this.state.nearbyGames)
        {
            console.log("Marker added");
            // add games as markers
            let position = new google.maps.LatLng(game.coords.lat, game.coords.lng);

            var marker = new google.maps.Marker({position:position});

            markers.push(this.state.map);
        }
    }

    render() {

    if (navigator.geolocation)
    {
    return (
        <div>
            <NavBar/>
            <div className="Map">
                <h1>Games near you</h1>
                <div ref="map" style={{height: "500px", width: "100%"}}></div>
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
