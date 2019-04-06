function loading() {
    console.log("DO STH");
    document.getElementById('formularInscriere').action = "https://www.google.com";
    console.log(document.getElementById('formularInscriere').action);
    location.replace("HTML/loading.html");
}

window.onload = function() {

    document.getElementById("readyToSpeak").onclick = function() {
        console.log("te am apasat fmm");
        document.getElementById('timer').style.display='block';
        setTimeout(loading, 10000);
        // document.getElementById("formularInscriere").style.display = "none";
    }


};


