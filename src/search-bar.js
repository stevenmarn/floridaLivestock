import mapsapi from 'google-maps-api'
import {inject, customElement} from 'aurelia-framework'

@customElement('search-bar')
@inject(Element, mapsapi('AIzaSyBnFLPXskzg9iu-LUTzBt9wSy4Oun1Qgw0', ['places']))
export class SearchBar {
    location = {name: 'Sanford, FL', lat: 28.8, lng: -81.2};
    geocoder;
    name;
    latlng;

    constructor (element, mapsapi){
        this.element = element;
        this.mapsapi = mapsapi;        
    }

    attached(){
        this.input = this.element.querySelector('.search-autocomplete');
        this.mapsapi.then( maps => {
            var autocomplete = new google.maps.places.Autocomplete(this.input);
            this.geocoder = new google.maps.Geocoder();
            this.input = this.locator;
            autocomplete.addListener('place_changed', () => {
                // marker.setVisible(false);
                var place = autocomplete.getPlace();
                console.log(place);
                if (place.geometry) {
                this.location.name = place.name;
                this.location.lat = place.geometry.location.lat();
                this.location.lng = place.geometry.location.lng();
                // updateMarker();
                }
            });
            this.geoLocate();
        })


    }

    changeValByRef()
    {
        this.locator.value = this.geoLocate();
        this.locator.dispatchEvent(new Event('change'));
    }


    geoLocate(){
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(position => {
                this.latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
                this.geocode();
            })
        }
    }

    geocode() {
        this.geocoder.geocode (
            {'location': this.latlng}, 
            function(results, status) {
                if (status === 'OK'  && results[0]) {
                    var city;
                    var state;
                    for (let i=0; i < results[0].address_components.length; i++) {
                    let addressArray = results[0].address_components[i];
                    console.log(results);
                        if(addressArray.types[0] == 'locality') {
                            city = addressArray.short_name;
                        }
                        else if(addressArray.types[0] == 'administrative_area_level_1') {
                            state = addressArray.short_name;
                        }
                    }
                    name = city + ", " + state;
                }
            }
        )
        this.location = {
            name: name, 
            lat: this.latlng.lat, 
            lng: this.latlng.lng
        };
    }
        

}