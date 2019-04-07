function goBack() {
    location.replace("../index.html");
}

window.onload = function() {
    setTimeout(goBack, 3000);
}