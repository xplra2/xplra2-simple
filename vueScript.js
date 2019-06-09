var firebaseConfig = {
  apiKey: "AIzaSyAyDf8SscMFHHtxIP35NSVqkfbxTrEVCaM",
  authDomain: "xplra2.firebaseapp.com",
  databaseURL: "https://xplra2.firebaseio.com",
  projectId: "xplra2",
  storageBucket: "xplra2.appspot.com",
  messagingSenderId: "522767696585",
  appId: "1:522767696585:web:9131abc3e8dd0172"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// TODO: this is dumb and should be a function vs. just the same thing over and over:

db.collection("construction").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        createPin({lat: doc.data().Location.latitude, lng: doc.data().Location.longitude}, map, "[" + doc.data().Type + "] " + doc.data().Notes, 'ConstructionPin', doc.data());
    });
});

db.collection("garage").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        createPin({lat: doc.data().Location.latitude, lng: doc.data().Location.longitude}, map, doc.data().Cost + "/" + doc.data().CostType + " [" + doc.data().SpacesAvailable + " available]", 'GaragePin', doc.data());
    });
});

db.collection("parkingattendant").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        createPin({lat: doc.data().Location.latitude, lng: doc.data().Location.longitude}, map, doc.data().ThreatLevel + " [car: " + doc.data().CarPresent + "]", 'ParkingAttendent', doc.data());
    });
});

db.collection("parkshare").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        createPin({lat: doc.data().Location.latitude, lng: doc.data().Location.longitude}, map, doc.data().Description, 'ParkShare', doc.data());
    });
});

db.collection("street").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        // console.log(`${doc.data().Type}`);
        // console.log(`${doc.data().Location}`);
        // console.log(`${doc.data().Location.latitude}`);
        // console.log(`${doc.data().Location.longitude}`);
        createPin({lat: doc.data().Location.latitude, lng: doc.data().Location.longitude}, map, doc.data().Type, 'StreetParkingPin', doc.data());
    });
});

var map;
var MyGeocoder;

// pass in 'ConstructionPin' as format for pinType
function createPin(latLong, myMap, title, pinType, data){
  var marker = new google.maps.Marker({
    position: latLong,
    map: myMap,
    title: title,
    icon: './src/markers/' + pinType + '.svg',
    data: data
  }).addListener('click', function(){
    recenterOnClick(latLong, 17);
    console.log(data);
    console.log(latLong);
    globalActions.createCard(pinType, data, latLong);
  });
}

function recenterOnClick(latLong, zoomLevel){
  map.setCenter(latLong);
  map.setZoom(zoomLevel);
}

function geocodeLatLng(geocoder, latlng) {
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        console.log(results[0].formatted_address);
        globalActions.reverseGeoCode = results[0].formatted_address;
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

  map.addListener('click', function() {
    globalActions.deselectCards();
  });
    

  // createPin(myLatLng, map, "fjkladsfdjal", 'GaragePin');
  // geocodeLatLng(MyGeocoder, {lat: 42.2808, lng: -83.7430});
}



let globalActions = new Vue({
  el: '#wrapper',
  data: {
    userLocation: '',
    isGarage: false,
    isParkingAttendant: false,
    isConstruction: false,
    isParkShare: false,
    isStreetParking: false,
    reverseGeoCode: '', // This is the street address in clean text
    myCurrentData: {},
  },
  methods: {
    getLocation: function(){     
        function error() {
          console.log('Unable to retrieve your location'); 
        }
      
        if (!navigator.geolocation) {
          console.log('Geolocation is not supported by your browser');
        } else {
          navigator.geolocation.getCurrentPosition(this.getUserLatLong, error);
        }
      
    },

    getUserLatLong: function(position){
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
      const dict = {lat: latitude, long: longitude};
      console.log(dict)
      this.userLocation = dict;
    },

    createCard: function(pinType, markerData, latLong){
      this.deselectCards();
      this.isCardSelected = true;
      this.myCurrentData = markerData;
      geocodeLatLng(MyGeocoder, latLong);
      console.log(this.reverseGeoCode)

      if (pinType === 'ConstructionPin'){

      }
      else if (pinType === 'GaragePin'){
        this.isGarage = true;
      }
      else if (pinType === 'ParkingAttendent'){

      }
      else if (pinType === 'ParkShare'){
        this.isParkShare = true;
      }
      else if (pinType === 'StreetParkingPin'){

      }
      else{
        this.isCardSelected = false;
        console.log('Bad pin type format')
      }
    },

    deselectCards: function(){
      // removes cards from display
      this.isGarage = false;
      this.isParkingAttendant = false;
      this.isConstruction = false;
      this.isStreetParking = false;
      this.isParkShare = false;
      this.myCurrentData = null;
      this.reverseGeoCode = '';
    },



    // displaycard: function(){
    // }

  },
  
  mounted() {
    console.log('hello world');
  },

  beforeCreate() {
    
  },
})