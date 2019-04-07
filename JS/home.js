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

    document.getElementById("nexButton").onclick = function() {
        document.getElementById('speechRecognition').style.display='block';
        // console.log(this.parentNode);
        this.parentNode.style.display ="none";

    }

    document.getElementById("readyToSpeak").onclick = function() {
        setTimeout(loading, 15000);
        // document.getElementById("formularInscriere").style.display = "none";
        enrollNewProfile();
    }





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

