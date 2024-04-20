document.addEventListener('DOMContentLoaded', function() {
    const divElement = document.getElementById('gezilecekYerler');
    
    divElement.addEventListener('click', function() {
        window.location.href = '../popdest';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const imgElement = document.getElementById('dropdownUser1');
    
    imgElement.addEventListener('click', function() {
        alert("Resme tıklanıldı!");
    });
});


       



  

