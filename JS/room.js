// // Get the modal
// var modal1 = document.getElementById('createRoom');
// var modal2 = document.getElementById('formularInscriere');
// var modal3 = document.getElementById('speechRecognition');
//
// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     } else if (event.target == modal1) {
//         modal.style.display = "none";
//     } else if (event.target == modal3) {
//         modal.style.display = "none";
//     }
// };

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


    // console.log(localStorage.getItem("roomname"));
    document.getElementById("roomNumber").innerText = localStorage.getItem("roomname");
    // console.log(parseInt(localStorage.getItem("selectedNum")));
    for (var i = 0; i < parseInt(localStorage.getItem("selectedNum")); ++i) {
        // console.log(localStorage.getItem(i.toString()));
        var persoana = document.createElement("P");
        persoana.innerHTML = localStorage.getItem(i.toString());
        //var parent = document.getElementById("peopleOnline").parentNode;
        // console.log(parent);
        persoana.className="person";
        persoana.id = i.toString();
        // console.log(persoana);
        // console.log(persoana.classList);
        var popUp = document.createElement("DIV");
        popUp.id = "id" + i.toString();
        popUp.className="modal";
        var content = document.createElement("DIV");
        content.className="modal-content animate";

        var header = document.createElement("DIV");
        header.className = "imgcontainer";
        var closeX = document.createElement("SPAN");

        closeX.className="close";
        closeX.innerText="x";
        closeX.title="Close Modal";
        header.append(closeX);
        var profilePic = document.createElement("IMG");
        profilePic.src = "../images/avatar.png";
        profilePic.className="avatar";
        header.append(profilePic);

        var about = document.createElement("DIV");
        about.className = "container";
        var txt = document.createElement("P");
        txt.innerHTML = localStorage.getItem(i.toString());
        about.append(txt);
        content.append(header);
        content.append(about);
        popUp.append(content);

        document.body.append(popUp);
        document.getElementById("peopleOnline").parentNode.append(persoana);
        // console.log(persoana.className);

        document.getElementById("peopleOnline").parentNode.append(document.createElement("BR"));

    }


    let people = document.getElementsByClassName("person");
    // console.log(people[0]);

    for(var i=0; i<people.length; i++) {
        // console.log("ma-ta");
        console.log(people[i]);
        people[i].onclick = function(event) {
            // console.log(people[i].childNodes[1]);
            // console.log(this.childNodes[1]);
            // document.getElementById(i.toString()).style.display = "block";
            // this.childNodes[1].style.display = "block";
            console.log(this);
            console.log(this.id);
            console.log(document.getElementById('id' + this.id));
            document.getElementById('id' + this.id).style.display = "block";
        }
    }

    // if(document.getElementsByClassName("close")[0].style.display == "block" ) {
    //
    // } else {
    //
    // }

    document.getElementsByClassName("close")[0].onclick = function(ev) {
        console.log("adadad");
        ev.target.parentNode.parentNode.parentNode.style.display = 'none';
        // document.getElementById(i.toString()).style.display='none';
    }
    document.getElementsByClassName("close")[1].onclick = function(ev) {
        console.log("adadad");
        ev.target.parentNode.parentNode.parentNode.style.display = 'none';
        // document.getElementById(i.toString()).style.display='none';
    }



}

