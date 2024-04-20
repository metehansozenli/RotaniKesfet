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


function menuToggle() {
  const toggleMenu = document.querySelector(".menu");
  toggleMenu.classList.toggle("active");
}


fetch('/user')

    .then(data => {
        console.log("hayir");
        
        const fullName = `${data.userName} ${data.userSurname}`;
        
        document.getElementById('userName').innerText = `${fullName} (@${data.userNickname})`;
    })
    .catch(error => {
        console.error('Hata oluştu:', error);
    });




       



  

