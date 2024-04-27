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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/loadComments'); // /loadComments endpoint'ine GET isteği gönder
        const data = await response.json(); // Gelen veriyi JSON formatına çevir
        console.log(data); // Veriyi konsola yazdır veya başka bir şey yap
    } catch (error) {
        console.error('Error loading comments:', error);
    }
});



    


       



  

