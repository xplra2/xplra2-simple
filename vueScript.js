var map;
var MyGeocoder;

// pass in 'ConstructionPin' as format for pinType
function createPin(latLong, myMap, title, pinType){
  var marker = new google.maps.Marker({
    position: latLong,
    map: myMap,
    title: title,
    icon: './src/markers/' + pinType + '.svg',
  }).addListener('click', function(){
  });
}

function geocodeLatLng(geocoder, latlng) {
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        console.log(results[0].formatted_address)
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}


var myLatLng = {lat: 42.2808, lng: -83.7430};
function initMap() {
  MyGeocoder = new google.maps.Geocoder()

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.2808, lng: -83.7430},
    zoom: 14
  })

  // createPin(myLatLng, map, "fjkladsfdjal", 'GaragePin');
  // geocodeLatLng(MyGeocoder, {lat: 42.2808, lng: -83.7430});
  // document.getElementById.
}
createPin(myLatLng, map, "fjkladsfdjal", 'GaragePin');





let globalActions = new Vue({
  el: '#wrapper',
  data: {
    location: '',
    isCardSelected: false,
  },
  methods: {
    getLocation: function(){      
        function error() {
          console.log('Unable to retrieve your location'); 
        }
      
        if (!navigator.geolocation) {
          console.log('Geolocation is not supported by your browser');
        } else {
          navigator.geolocation.getCurrentPosition(this.latLong, error);
        }
      
    },

    latLong: function(position){
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
      const dict = {lat: latitude, long: longitude};
      console.log(dict)
      this.location = dict;
    },

    createCard: function(pinType, lat, long){
      this.isCardSelected = true;
      if (pinType === 'ConstructionPin'){
        
      }
      else if (pinType === 'GaragePin'){

      }
      else if (pinType === 'ParkingAttendent'){

      }
      else if (pinType === 'ParkShare'){

      }
      else if (pinType === 'StreetParkingPin'){

      }
      else{
        this.isCardSelected = false;
        console.log('Bad pin type format')
      }
    },

    deselectCard: function(){
      // removes card
      this.isCardSelected = false;
    }

  },
  
  mounted() {
    console.log('hello world');
  },

  beforeCreate() {
    
  },
})

// let cards = new Vue.component('Constuction-Pin', {
//   data: function() {
//     return {

//     }
//   }
//   template: 
//   `
  
//   `
// })


