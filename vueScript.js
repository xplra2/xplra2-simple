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

db.collection("parkshare").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        console.log(`${doc.data().Description}`);
        console.log(`${doc.data().Location}`);
        console.log(`${doc.data().Location.latitude}`);
        console.log(`${doc.data().Location.longitude}`);
        createPin({lat: doc.data().Location.latitude, lng: doc.data().Location.longitude}, map, doc.data().Description, 'ParkShare');
    });
});


var map;

// pass in 'ConstructionPin' as format for pinType
function createPin(latLong, myMap, title, pinType){
  var marker = new google.maps.Marker({
    position: latLong,
    map: myMap,
    title: title,
    icon: './src/markers/' + pinType + '.svg',
  });
}

var myLatLng = {lat: 42.2808, lng: -83.7430};
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.2808, lng: -83.7430},
    zoom: 14
  });

  createPin(myLatLng, map, "fjkladsfdjal", 'GaragePin');
}



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


