document.addEventListener("DOMContentLoaded", function() {
    exportPDFButton = document.getElementById("exportButton");

    exportPDFButton.addEventListener('click', function() {
        genPDF();
    });
});

function genPDF() {
    var doc = new jsPDF();

    doc.fromHTML(document.getElementById("phraseDiv"), 20, 20, { 'width': 500 });
    let roomNumber = document.getElementById("roomNumber").innerText;

    doc.save("ConferenceRoom_" + roomNumber + ".pdf");
}