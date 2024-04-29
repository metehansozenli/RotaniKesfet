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


//Score ayarları
document.addEventListener('DOMContentLoaded', function() {
    // Tüm .point öğelerini seç
    const points = document.querySelectorAll('.point');
    
    // Her bir .point öğesi için işlem yap
    points.forEach((pointElement) => {
        const point = parseFloat(pointElement.textContent);
        const stars = pointElement.nextElementSibling.querySelectorAll('.ratings i');

        // Yıldızları güncelle
        stars.forEach((star, index) => {
            if (index < Math.floor(point)) { // Puanı aşağıya yuvarlayarak yıldızları dolduruyoruz
                star.classList.add('rating-color', 'fa', 'fa-star');
            } else if (point - index >= 0.25 && point - index < 0.75) { // 0.25 ile 0.75 arasında ise yarım yıldız ekle
                star.classList.add('rating-color', 'fa', 'fa-star-half-alt');
            } else if (point - index >= 0.75 && point - index < 1) { // 0.75 ile 1 arasında ise tam yıldız ekle
                star.classList.add('rating-color', 'fa', 'fa-star');
            } else { // Diğer durumlarda boş yıldız ekle
                star.classList.add('fa', 'fa-star-o');
            }
        });
    });
});



    


       



  

