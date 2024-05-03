document.addEventListener('DOMContentLoaded', function () {
    const popdest = document.getElementById('popdest');
    const otels = document.getElementById('hotels');
    const restaurants = document.getElementById('restaurants');

    popdest.addEventListener('click', function () {
        window.location.href = '../popdest';
    });

    otels.addEventListener('click', function () {
        window.location.href = '../hotels';
    });

    restaurants.addEventListener('click', function () {
        window.location.href = '../restaurants';
    });
});



function menuToggle() {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu.classList.toggle("active");
}


fetch('/user')

    .then(data => {

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



//Genel yıldızları ayarlama
document.addEventListener('customLoadEvent', function () {
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

document.addEventListener('DOMContentLoaded', function () {
    document.dispatchEvent(new CustomEvent('customLoadEvent'));
    load_data();
  
});

//Küçük yorumların yıldızlarının ayarı
document.addEventListener('DOMContentLoaded', function () {
    // Tüm .point öğelerini seç
    const points = document.querySelectorAll('.comment-point h5');
    

    // Her bir .point öğesi için işlem yap
    points.forEach((pointElement) => {
        const point = parseFloat(pointElement.textContent);
        const stars = pointElement.parentElement.querySelector('.comment-point .comment-stars').querySelectorAll('span');
        // Yıldızları güncelle
        stars.forEach((star, index) => {
            if (index < Math.floor(point)) { // Puanı aşağıya yuvarlayarak yıldızları dolduruyoruz
                star.classList.add('active-star', 'fa', 'fa-star');
            } else if (point - index >= 0.25 && point - index < 0.75) { // 0.25 ile 0.75 arasında ise yarım yıldız ekle
                star.classList.add('active-star', 'fa', 'fa-star-half-alt');
            } else if (point - index >= 0.75 && point - index < 1) { // 0.75 ile 1 arasında ise tam yıldız ekle
                star.classList.add('active-star', 'fa', 'fa-star');
            } else { // Diğer durumlarda boş yıldız ekle
                star.classList.add('fa', 'fa-star-o');
            }
        });
    });
});










