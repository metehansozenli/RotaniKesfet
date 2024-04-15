document.addEventListener("DOMContentLoaded", function() {
    var kaydolBtn = document.getElementById("kaydolBtn");
    var modal = document.getElementById("kaydolModal");

    // Kaydol butonuna tıklandığında modalı göster
    kaydolBtn.addEventListener("click", function() {
        modal.style.display = "block";
    });

    // Modal dışına tıklandığında modalı gizle
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});
