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
var directionsService;
var directionsDisplay;

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
        commaSplit =  globalActions.reverseGeoCode.split(",");
        spaceSplit = commaSplit[0].split(" ")
        if (spaceSplit.length == 4) {
          globalActions.reverseGeoCode = spaceSplit[2]
        }
        else {
          globalActions.reverseGeoCode = spaceSplit[1]
        }
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
  MyGeocoder = new google.maps.Geocoder();
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

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
    isGarageAdd: false,
    isParkingAttendant: false,
    isParkingAttendantAdd: false,
    isConstruction: false,
    isConstructionAdd: false,
    isParkShare: false,
    isParkShareAdd: false,
    isStreetParking: false,
    isStreetParkingAdd: false,
    isSignup: false,
    isArrivedAt: false,
    comingFrom:  {},
    timePaidFor: '',
    user_id: '',
    reverseGeoCode: '', // This is the street address in clean text
    myCurrentData: {},
    signUpData: {},
    isSignupConfirm: false,
    isSignedIn: false,
    userData: {},
    settingsPanel: false,
    addPanel: false,
    selected: '',
    fieldOne: '',
    fieldTwo: ''
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
      const dict = {lat: latitude, lng: longitude};
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
        this.isConstruction = true;
        var myTime = new Date(1970, 0, 1); // Epoch
        myTime.setSeconds(this.myCurrentData.Expiration.seconds); 
        var hours = myTime.getHours();
        var minutes = myTime.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        this.myCurrentData.myTime = myTime.getMonth()+1 + "/" + myTime.getDate() + "/" + myTime.getFullYear() + "  " + strTime
      }
      else if (pinType === 'GaragePin'){
        this.isGarage = true;
      }
      else if (pinType === 'ParkingAttendent'){
        this.isParkingAttendant = true;
      }
      else if (pinType === 'ParkShare'){
        this.isParkShare = true;
        console.log(this.myCurrentData.EndTime);
        var myTime = new Date(1970, 0, 1); // Epoch
        myTime.setSeconds(this.myCurrentData.EndTime.seconds); 
        var hours = myTime.getHours();
        var minutes = myTime.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        this.myCurrentData.myTime = strTime
      }
      else if (pinType === 'StreetParkingPin'){
        this.isStreetParking = true;
      }
      else{
        this.isCardSelected = false;
        console.log('Bad pin type format');
      }
    },

    submitSignUp: function() {
      //this.signUpData Contains stuff we need
      db.collection('users').doc(this.signUpData.phone_number).set({
        FirstName: this.signUpData.first_name,
        LastName: this.signUpData.last_name,
        PhoneNumber: this.signUpData.phone_number,
        email: this.signUpData.email,
        password: this.signUpData.password,
      });
      this.isSignedIn = true;
      this.userData = this.signUpData;
      this.signUpData = {};
      this.deselectCards();
      this.isSignupConfirm = true;
    },

    openSettings: function(){
      this.deselectCards();
      this.settingsPanel = true;
    },

    openSignup: function(){
      this.deselectCards();
      this.isSignup = true;
    },

    openAddPanel: function(){
      this.deselectCards();
      this.addPanel = true;
    },

    addParkingAttendant: function(){
      this.deselectCards();
      this.isParkingAttendantAdd = true;
    },
    addGarage: function(){
      this.deselectCards();
      this.isGarageAdd = true;

    },
    addStreetParking: function(){
      this.deselectCards();
      this.isStreetParkingAdd = true;
    },
    addParkShare: function(){
      this.deselectCards();
      this.isParkShareAdd = true;
    },
    addConstruction: function(){
      this.deselectCards();
      this.isConstructionAdd = true;
    },

    arrivedAt: function(){
      this.comingFrom =  this.myCurrentData
      console.log(this.comingFrom)
      this.deselectCards();
      this.isArrivedAt = true;
    },

    submitArrivedAt: function(){
      var minutes = this.timePaidFor.split(' ')[0]
    //   db.collection("construction").get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         createPin({lat: doc.data().Location.latitude, lng: doc.data().Location.longitude}, map, "[" + doc.data().Type + "] " + doc.data().Notes, 'ConstructionPin', doc.data());
    //     });
    // });
      db.collection("streetpark").doc(this.comingFrom.IDS[0]).get().then(function(doc) {
        const streetPark = doc.data();
        console.log(streetPark.UserID);
        db.collection("streetpark").doc("first").set({
          PhoneNumber: "+1" + '9085140960',
          Expired: false,
          Number: 1234,
        })
        db.collection("streetpark").doc("first").set({
          PhoneNumber: "+1" + '9085140960',
          Expired: true,
          Number: 1234,
        })
      }).catch(function(error) {
        console.log("Error getting document:", error);
        });
      console.log(this.comingFrom.IDS[0])
      console.log(this.userData)
      this.deselectCards();
      // setTimeout(this.runTwilio(), 30000)
      // db.collection(this.comingFrom.IDS[0]).doc().set({
      //   Expired: false,
      //   TimeDuration: minutes,
      //   PhoneNumber: this.userData.PhoneNumber
      // }) 
    },


    deselectCards: function(){
      // removes cards from display
      this.isGarage = false;
      this.isGarageAdd = false;
      this.isParkingAttendant = false;
      this.isParkingAttendantAdd = false;
      this.isConstruction = false;
      this.isConstructionAdd = false;
      this.isStreetParking = false;
      this.isStreetParkingAdd = false;
      this.isParkShare = false;
      this.isArrivedAt = false;
      this.isParkShareAdd = false;
      this.myCurrentData = null;
      this.settingsPanel = false;
      this.isSignup = false;
      this.addPanel = false;
      this.isSignupConfirm = false;
      this.reverseGeoCode = '';
      this.selected = 'Mild';
      this.fieldOne = '';
      this.fieldTwo = '';
    },

    submitParkingAttendant: function(){
      this.getLocation();

      var date = new Date(); 
      var timestamp = Math.round(date.getTime()/1000);
      var toSend = new firebase.firestore.Timestamp(timestamp);
      var stuff;
      setTimeout(function(){
        stuff = new firebase.firestore.GeoPoint(this.userLocation.lat, this.userLocation.lng);
        console.log(stuff)
        db.collection('parkingattendant').doc().set({
          CarPresent: 'false',
          LastReportedAt: toSend,
          Location: stuff,
          ThreatLevel: this.selected
        })        
      }.bind(this), 100);

    },

    submitParkShare: function(){
      this.getLocation();

      var date = new Date(); 
      var timestamp = Math.round(date.getTime()/1000);
      var toSendEarly = new firebase.firestore.Timestamp(timestamp);
      
      var endTimeStamp = (parseFloat(this.selected) * 60.0) + timestamp
      var toSendEnd = new firebase.firestore.Timestamp(endTimeStamp);
      var stuff;

      setTimeout(function(){
        stuff = new firebase.firestore.GeoPoint(this.userLocation.lat, this.userLocation.lng);
        console.log(stuff)
        db.collection('parkshare').doc().set({
          Cost: this.fieldOne,
          Description: this.fieldTwo,
          EndTime: toSendEnd,
          Location: stuff,
          Occupied: false,
          StartTime: toSendEarly,
        })
        .then(() => {
          document.location.reload();
        })
      }.bind(this), 100);
      
      
    },

    submitStreet: function(){
      this.getLocation();

      var date = new Date(); 
      var timestamp = Math.round(date.getTime()/1000);
      var toSendEarly = new firebase.firestore.Timestamp(timestamp);
      
      var endTimeStamp = (parseFloat(this.selected) * 60.0) + timestamp
      var toSendEnd = new firebase.firestore.Timestamp(endTimeStamp);
      var stuff;

      setTimeout(function(){
        stuff = new firebase.firestore.GeoPoint(this.userLocation.lat, this.userLocation.lng);
        console.log(stuff)
        db.collection('street').doc().set({
          Cost: this.fieldOne,
          CostType: 'Hr',
          ID: 'myID2',
          IDs: [],
          LastReportedAt: toSendEarly,
          Location: stuff,
          Type: 'metered',
          description: this.fieldTwo,
        })        
      }.bind(this), 100);
    }
    
  },
  
  mounted() {
    console.log('hello world');
  },

  beforeCreate() {
    
  },
})