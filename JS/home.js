function goBack() {
    location.replace("index.html");

}


function loading() {
    console.log("DO STH");
    document.getElementById('timer').style.display='block';
    // document.getElementById('formularInscriere').action = "https://www.google.com";
    console.log(document.getElementById('formularInscriere').action);
    //location.replace("HTML/loading.html");
    setTimeout(goBack, 10000); //de pus la loc pe 5000
}

window.onload = function() {
    loadProfiles();
    localStorage.setItem("selectedNum", 0);
    let users = getProfiles();
    let peopleSelected = document.getElementById("peopleSelectedTextArea");

    document.getElementById("nexButton").onclick = function() {
        document.getElementById('speechRecognition').style.display='block';
        // console.log(this.parentNode);
        this.parentNode.style.display ="none";
    };

    document.getElementById("readyToSpeak").onclick = function() {
        setTimeout(loading, 15000);
        // document.getElementById("formularInscriere").style.display = "none";
        enrollNewProfile();
    };

    document.getElementById("createRoomButton").addEventListener('click', function () {



        db.collection("SelectedPeopleInRoom").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(docc) {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                db.collection("SelectedPeopleInRoom").doc(docc.id).delete();
            });
        });

        document.getElementById('createRoom').style.display='block';

        console.log("We have to add users now");
        for (let i = 0; i < users.length; ++i) {
            let newOption = document.createElement("OPTION");
            newOption.innerText = users[i].nume;

            document.getElementById("peopleSelection").appendChild(newOption);
        }

        let options = document.getElementById("peopleSelection").children;
        let selectedOptions = [options.length];

        for (let i = 0; i < options.length; ++i) {
            selectedOptions[i] = 0;
        }

        for (let i = 0; i < options.length; ++i) {
            options[i].addEventListener('click', function() {
                selectedOptions[i]++;
                if (selectedOptions[i] === 1) {
                    console.log(options[i].innerHTML);
                    // console.log(document.getElementById("peopleSelectedTextArea").innerText);
                    // let text = document.getElementById("peopleSelectedTextArea").innerText + options[i].innerHTML + ", ";
                    // console.log(text);
                    // document.getElementById("peopleSelectedTextArea").innerText = text;

                    let newP = document.createElement("P");
                    newP.innerText = options[i].innerHTML;
                    
                    // localStorage.setItem(localStorage.getItem("selectedNum"), options[i].innerHTML);
                    // localStorage.setItem("selectedNum", parseInt(localStorage.getItem("selectedNum")) + 1);

                    db.collection("SelectedPeopleInRoom").doc(options[i].innerHTML).set({
                        nume : options[i].innerHTML,
                        roomname : document.getElementsByName("roomname")[0].value
                    });

                    peopleSelected.appendChild(newP);
                }

                options[i].style.backgroundColor = "lightblue";
            });
        }

        document.getElementById("nextButtonCreateRoom").addEventListener('click', function() {
            // db.collection("RoomNames").doc(document.getElementsByName("roomname")[0].value).set({
            //     nume : document.getElementsByName("roomname")[0].value
            // });

            location.replace("HTML/room.html");
        });
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        // Get the modal
        var modal = document.getElementById('formularInscriere');
        console.log(modal);
        console.log(event.target);
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};

// <button type="button" onclick="document.getElementById('speechRecognition').style.display = 'block'">Next</button>

