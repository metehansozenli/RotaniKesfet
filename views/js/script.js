
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
    console.log(window.userID);
}

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
    // BU ŞEKİLDE USERID KONSOL ÇIKTISI OLARAK GELİYOR İNDEX.HBS'DEN 

});



//Küçük yorumların yıldızlarının ayarı
document.addEventListener('customCommentLoadEvent', function () {
    // Tüm .point öğelerini seç
    const points = document.querySelectorAll('.comment-score');


    // Her bir .point öğesi için işlem yap
    points.forEach((pointElement) => {
        const point = parseFloat(pointElement.textContent);
        const stars = pointElement.parentElement.querySelector('.comment-stars').querySelectorAll('span');

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


function favControl() {
    let icons = document.querySelectorAll('ion-icon');

    icons.forEach(function (icon) {
        icon.onclick = function () {
            if (window.userID) {
                icon.classList.toggle('active');
                console.log(`${userID} BEĞENDİ`);

            } else {
                $('#loginAlert').modal('show');
            }

            // icon.onclick = async function () {
            //     if (icon.classList.toggle('active')) {
            //         console.log(c+=1);
            //         const result = await client.query(`UPDATE users 
            //                                     SET "userFavLocations" = ARRAY_APPEND("userFavLocations", $1) 
            //                                     WHERE "userID"=6;`,[2]);
            //     } else {//Aktiflik kaldırılırsa
            //         console.log(c-=1);
            //     }
        };
    });
}

function locationStatus() {
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
};

// Formu kontrol etme fonksiyonu
function validateForm() {
    var email = document.forms["kayitFormu"]["email"].value;
    var ad = document.forms["kayitFormu"]["ad"].value;
    var soyad = document.forms["kayitFormu"]["soyad"].value;
    var nickname = document.forms["kayitFormu"]["nickname"].value;
    var sehir = document.forms["kayitFormu"]["sehir"].value;
    var ulke = document.forms["kayitFormu"]["ulke"].value;
    var telefonNumarasi = document.forms["kayitFormu"]["telefonNumarasi"].value;
    var sifre = document.forms["kayitFormu"]["sifre"].value;

    if (email == "" || ad == "" || soyad == "" || nickname == "" || sehir == "" || ulke == "" || telefonNumarasi == "" || sifre == "") {
        alert("Lütfen tüm alanları doldurun");
        return false;
    }

    // E-posta doğrulaması
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Geçerli bir e-posta adresi girin");
        return false;
    }


    return true;
}



document.addEventListener('customlikeControlEvent', function () {
    // Tüm .vote-section öğelerini seç
    const votes = document.querySelectorAll('.vote-section');

    // Her bir .vote-section öğesi için işlem yap
    votes.forEach((voteElement) => {
        // Her bir .vote-section içindeki like ve dislike butonlarını seç
        const likeBtn = voteElement.querySelector('.likeBtn');
        const dislikeBtn = voteElement.querySelector('.dislikeBtn');
        const likeCountSpan = likeBtn.querySelector('span');
        const dislikeCountSpan = dislikeBtn.querySelector('span');
        const commentID = voteElement.dataset.commentid;
        let isButtonLocked = false; // Buton kilitleme durumu


        likeBtn.addEventListener('click', function () {


            if (isButtonLocked) return;
            isButtonLocked = true;

            // 1 saniye sonra butonun kilidini kaldır
            setTimeout(() => {
                isButtonLocked = false;
            }, 1000);

            // Dislike butonu seçiliyse, seçimini kaldır
            if (!window.userID) { $('#loginAlert').modal('show'); return; }

            const dislikeBtnActive = dislikeBtn.classList.contains('voteActive');
            const likeBtnActive = likeBtn.classList.contains('voteActive');


            if (dislikeBtnActive) {
                dislikeBtn.classList.remove('voteActive');

                let dislikeCount = parseInt(dislikeCountSpan.textContent);
                dislikeCount--;
                dislikeCountSpan.textContent = dislikeCount;

            }

            if (likeBtnActive) {
                let likeCount = parseInt(likeCountSpan.textContent);
                likeCount--;
                likeCountSpan.textContent = likeCount;
                this.classList.remove('voteActive');

            } else {
                let likeCount = parseInt(likeCountSpan.textContent);
                likeCount++;
                likeCountSpan.textContent = likeCount;
                this.classList.toggle('voteActive');

            }



            sendLikeDislikeToServer(commentID, window.userID, "like");




        });

        // Dislike butonu için tıklama olayını ekle
        dislikeBtn.addEventListener('click', function () {

            if (isButtonLocked) return;
            isButtonLocked = true;

            // 1 saniye sonra butonun kilidini kaldır
            setTimeout(() => {
                isButtonLocked = false;
            }, 1000);


            if (!window.userID) { $('#loginAlert').modal('show'); return; }
            // Like butonu seçiliyse, seçimini kaldır
            const likeBtnActive = likeBtn.classList.contains('voteActive');
            const dislikeBtnActive = dislikeBtn.classList.contains('voteActive');



            if (likeBtnActive) {
                let likeCount = parseInt(likeCountSpan.textContent);
                likeCountSpan.textContent = --likeCount;
                likeBtn.classList.remove('voteActive');

            }

            if (dislikeBtnActive) {
                let dislikeCount = parseInt(dislikeCountSpan.textContent);
                dislikeCount--;
                dislikeCountSpan.textContent = dislikeCount;
                this.classList.remove('voteActive');

            } else {
                let dislikeCount = parseInt(dislikeCountSpan.textContent);
                dislikeCount++;
                dislikeCountSpan.textContent = dislikeCount;
                this.classList.toggle('voteActive');

            }


            sendLikeDislikeToServer(commentID, window.userID, "dislike");



        });


    });

});


function sendLikeDislikeToServer(commentID, userID, voteType) {
    return new Promise((resolve, reject) => {
        // AJAX isteği için gereken veriyi hazırla
        const requestData = {
            commentID: commentID,
            userID: userID,
            voteType: voteType
        };

        // AJAX isteği gönder
        $.ajax({
            type: 'POST',
            url: '/update-like', // Sunucu tarafında işlenecek URL
            data: requestData,
            success: function (response) {
                // Sunucudan gelen yanıtı işle
                console.log('Sunucudan gelen yanıt:', response);
                resolve(response); // İşlem başarılı olduğunda resolve ile yanıtı döndür
            },
            error: function (xhr, status, error) {
                // Hata durumunda reject ile hatayı döndür
                console.error('Hata:', error);
                reject(error);
            }
        });
    });
}


function calculateStarWidths() {
    // Tüm yıldız öğelerini seçelim
    const star1 = document.querySelector('.star1');
    const star2 = document.querySelector('.star2');
    const star3 = document.querySelector('.star3');
    const star4 = document.querySelector('.star4');
    const star5 = document.querySelector('.star5');

    // Yıldızların toplamını hesaplayalım
    const totalStars = parseInt(star1.textContent) + parseInt(star2.textContent) + parseInt(star3.textContent) + parseInt(star4.textContent) + parseInt(star5.textContent);

    // Her bir yıldızın yüzde genişlik değerini hesaplayalım
    const percentageOfStar1 = (parseInt(star1.textContent) / totalStars) * 100;
    const percentageOfStar2 = (parseInt(star2.textContent) / totalStars) * 100;
    const percentageOfStar3 = (parseInt(star3.textContent) / totalStars) * 100;
    const percentageOfStar4 = (parseInt(star4.textContent) / totalStars) * 100;
    const percentageOfStar5 = (parseInt(star5.textContent) / totalStars) * 100;

    // Her bir bar öğesinin genişlik değerlerini ayarlayalım
    document.querySelector('.bar-5').style.width = percentageOfStar5 + '%';
    document.querySelector('.bar-4').style.width = percentageOfStar4 + '%';
    document.querySelector('.bar-3').style.width = percentageOfStar3 + '%';
    document.querySelector('.bar-2').style.width = percentageOfStar2 + '%';
    document.querySelector('.bar-1').style.width = percentageOfStar1 + '%';
}


function closeAndOpenModal(closeModal, openModal) {
    $(closeModal).modal('hide'); // Mevcut modali kapat
    $(openModal).modal('show'); // Diğer modalı aç

}

function checkSessionForcommentWrite(locationID) {

    if (window.userID) {
        window.location.href = "/commentWrite?id=" + locationID;

    } else {
        $('#loginAlert').modal('show');
    }
}

async function setFavStatus(userID, locationID) {

    try {
        const icon = document.getElementById("heart");
        const result = await client.query(`
                                            SELECT 
                                                "userFavLocations"
                                            FROM
                                                users 
                                            WHERE "userID" = $1 AND $2 = ANY ("userFavLocations");
                                          `, [userID, locationID]);

        if (result.rows.length > 0) {
            icon.classList.add('active');
        }
        else;

    } catch (error) {
        console.error("Sorgu Hatası:", error);
    }
}
