import React from 'react';
import NavBar from './NavBar';
import axios from "axios"
import {GameTable, Game} from './CurrentGames';
import {CreateGames} from './CreateGames';
//import '../css/Map.css';



class Map extends React.Component {
    DEFAULT_ZOOM = 13;
    MI_TO_KM = 1.609;
    constructor(props)
    {
        super(props);
        console.log("params",this.props.match.params);
        this.search=this.props.match.params.search;
        if(this.search!=null){
          while(!(/[0-9]|[a-z]/i.test(this.search[0]))){
      			this.search=this.search.substring(1,this.search.length);
      		}
        }
        console.log("USER",this.props.user);

        this.state = {
            userPosition : {lat: 37.758, lng: -122.473}, // San Francisco as default
            map : {},
            games : [],
            nearbyGames: [],

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


    retrieveNearbyGames() {
        let range = parseFloat(this.refs.range.value) * this.MI_TO_KM;
        console.log("Range:", range, "km");
        axios.post("/nearbygames", {range: range, center: this.state.userPosition}).then(
            (results) => {
                this.setState({nearbyGames : results.data});
                this.updateMap();
            }
        );

    }

    updateMap() {
        this.clearMarkers();
        console.log("adding markers");
        console.log(this.state.nearbyGames);
        this.state.nearbyGames.map((game) =>
        {
            console.log(game);
            // add games as markers
            // game.coords.coordinates = [lng, lat]
            let position = new google.maps.LatLng(game.coords.coordinates[1], game.coords.coordinates[0]);

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

    clearMarkers()
    {
        while (this.markers.length > 0)
        {
            let marker = this.markers.pop();
            marker.setMap(null);
        }
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

    reload()
    {
        if (this.onNewGame != undefined)
        {
            this.onNewGame();
        }
        this.retrieveNearbyGames();
    }

    render() {

    if (navigator.geolocation)
    {
    return (
        <div>
            <NavBar user={this.props.user}/>

            <div className="Map">
                <h1>Games near you</h1>
                <div ref="mapContainer" style={{width: "30%", float: "left"}}>
                    <div ref="map" style={{height: "500px"}} />
                    Distance(Miles):
                    <input type="text" ref="range"
                        defaultValue="5"
                        placeholder="Miles away" />
                    <input type="button" value="Refresh Map"
                        className="btn btn-primary"
                        onClick={this.retrieveNearbyGames.bind(this)} />
                </div>
                  <div className = "gameTableInMap">
                    <GameTable onNewGame={this.reload.bind(this)} user={this.props.user} defaultSearch={this.search}/>
                  </div>
            </div>


        </div>);
    } else {
        return (
        <div>
            <NavBar user={this.props.user}/>
            <div className="Map">
                <h1>Location must be allowed to use this feature</h1>
            </div>
        </div>);
    }


    }

}





export default Map;
