
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAuHMTUxKwIuLhCD6icuyAaap1Ic4CpzEU",
    authDomain: "bestem19-b856d.firebaseapp.com",
    databaseURL: "https://bestem19-b856d.firebaseio.com",
    projectId: "bestem19-b856d",
    storageBucket: "bestem19-b856d.appspot.com",
    messagingSenderId: "804641905361"
};

firebase.initializeApp(config);
var db = firebase.firestore();

// db.collection("Users").doc("profileID").set({
//     nume : "Ion",
//     profileID : "123-495"
// });
//
// db.collection("SelectedPeopleInRoom").doc("nume").set({
//     nume : "Ion",
//     roomName: "Room1"
// });

// db.collection("RoomNames").doc("roomName").set({
//     roomName: "Room 1"
// });