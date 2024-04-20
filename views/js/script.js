document.addEventListener('DOMContentLoaded', function() {
    const divElement = document.getElementById('gezilecekYerler');
    
    divElement.addEventListener('click', function() {
        window.location.href = '../popdest';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const imgElement = document.getElementById('logoutImg');
    imgElement.addEventListener('click', function() {
        window.location.href = '../logout';
    });
});

       



  

