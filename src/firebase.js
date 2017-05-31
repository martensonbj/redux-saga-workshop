const firebase = require("firebase/app");
               require("firebase/auth");
               require("firebase/database");

const config = {
   apiKey: "AIzaSyCIwVBIHDXxv7_8fomg5KShc5VpOHBoZAs",
   authDomain: "concept-box.firebaseapp.com",
   databaseURL: "https://concept-box.firebaseio.com",
   projectId: "concept-box",
   storageBucket: "concept-box.appspot.com",
   messagingSenderId: "204589940171"
 };
 
firebase.initializeApp(config);

const database = firebase.database();
const auth = firebase.auth();

export default firebase;
