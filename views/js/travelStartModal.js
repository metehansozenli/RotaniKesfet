var startBtn = document.getElementById("travelStartBtn");

function travelStartBtn() {
    // Butona tıklandığında yapılacak işlemi belirt
    startBtn.onclick = function() {
        $('#travelStartModal').modal('show');
    }
}
