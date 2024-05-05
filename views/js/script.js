document.addEventListener('DOMContentLoaded', function () {

    document.dispatchEvent(new CustomEvent('customLoadEvent'));
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




//Genel yıldızları ayarlama
document.addEventListener('customLoadEvent', function () {
    // Tüm .point öğelerini seç
    const points = document.querySelectorAll('.point');
    let icons = document.querySelectorAll('ion-icon');
    

    icons.forEach(function (icon) {
        icon.onclick = function () {
            icon.classList.toggle('active');
        }
        });

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




document.addEventListener('DOMContentLoaded', function () {
    var openTimeElement = document.getElementById("openTime");
    var locationStatus = document.querySelector(".location-status");

    if (openTimeElement && locationStatus) {
        var openTimeRange = openTimeElement.textContent.split("-"); // Açılış ve kapanış saatlerini ayır
        var openingTime = openTimeRange[0].split(":"); // Açılış saatini ve dakikasını ayır
        var closingTime = openTimeRange[1].split(":"); // Kapanış saatini ve dakikasını ayır

        var openingHour = parseInt(openingTime[0]); // Açılış saati
        var openingMinute = parseInt(openingTime[1]); // Açılış dakikası
        var closingHour = parseInt(closingTime[0]); // Kapanış saati
        var closingMinute = parseInt(closingTime[1]); // Kapanış dakikası

        var currentTime = new Date();
        var currentHour = currentTime.getHours();
        var currentMinute = currentTime.getMinutes();

        // Açılış ve kapanış saatlerini dakikaya çevir
        var openingTimeInMinutes = openingHour * 60 + openingMinute;
        var closingTimeInMinutes = closingHour * 60 + closingMinute;
        // Mevcut saati de dakikaya çevir
        var currentTimeInMinutes = currentHour * 60 + currentMinute;

        // Saat aralığına göre durumu belirle
        var statusText = "";
        var statusColor = "";
        if (currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes <= closingTimeInMinutes) {
            statusText = "Şu an açık";
            statusColor = "green"; // Açık olduğunda yeşil
        } else {
            statusText = "Şu an kapalı";
            statusColor = "red"; // Kapalı olduğunda kırmızı
        }

        // Metni "location-status" sınıfına sahip elementin içine yerleştir
        locationStatus.textContent = statusText;

        // Metnin rengini değiştir
        locationStatus.style.color = statusColor;
    }
});








