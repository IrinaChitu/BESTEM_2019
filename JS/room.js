// Get the modal
var modal1 = document.getElementById('createRoom');
var modal2 = document.getElementById('formularInscriere');
var modal3 = document.getElementById('speechRecognition');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    } else if (event.target == modal1) {
        modal.style.display = "none";
    } else if (event.target == modal3) {
        modal.style.display = "none";
    }
};

window.onload = function() {
    db.collection("SelectedPeopleInRoom").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    });

    var docRef = db.collection("SelectedPeopleInRoom").doc();
    //
    // var name = docRef.get().then(function(doc) {
    //     if (doc.exists) {
    //         console.log("Document data:", doc.data());
    //     } else {
    //         // doc.data() will be undefined in this case
    //         console.log("No such document!");
    //     }
    // }).catch(function(error) {
    //     console.log("Error getting document:", error);
    // });

    console.log();
}
