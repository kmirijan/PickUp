import React from 'react';
import '../css/Map.css';



class Map extends React.Component {
    const DEFAULT_ZOOM = 13    
    constructor(props)
    {
        super(props);
        this.state = {
            userPosition : {lat: 0, lng: 0},
            map : {},
            games : [],
            nearbyGames: [],
            range : 5, /* miles away from location */

        };
    }


    componentWillMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setUserPostion);
        }
    
    }

    componentDidMount()
    {
        if (navigator.geolocation) {
            // create a google map centered at the user's location
            let center = new google.maps.LatLng(this.state.userPosition.lat,
                    this.state.userPosition.lng);
            this.state.map = new google.maps.map(this.refs.map,
                    {center: center, zoom: DEFAULT_ZOOM});


        }


    }

    setUserPosition(position) {
        this.state.userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        // get nearby games
        retrieveNearbyGames();
    }
    

    const MILES_PER_DEGREE = 69;
    retrieveNearbyGames() {
        let range = {
            lat: this.state.range / MILES_PER_DEGREE,
            lng: Math.cos(this.state.userPosition.lat) * this.state.range / MILES_PER_DEGREE
        };

        axios.post("/nearbygames", {range: range, center, this.state.userPosition}).then(
            (results) => {
                this.state.nearbyGames = results.data;
                updateMap();
            }
        );
        
    }

    updateMap() {
        for (game in this.state.nearbyGames)
        {
            // add games as markers
        }
    }

    render() {

    if (navigator.geolocation)
    {
    return (
            <div className="Map">
                <h1>Games near you</h1>
                <div ref="map"/>
            </div>
        );
    } else {
        return (
            <div className="Map">
                <h1>Location must be allowed to use this feature</h1>
            <div>
        );
    }


    }

}





export default Map;
