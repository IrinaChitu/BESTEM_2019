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

