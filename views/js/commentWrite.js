let starContainers = document.querySelectorAll(".star-container");
const submitButton = document.querySelector("#submit");
const message = document.querySelector("#message");
const dateInput = document.getElementById('date');
const commentInput = document.getElementById('comment-input');
const submitSection = document.querySelector("#submit-section");


// Dokunmatik ve fare olayları
const events = {
    mouse: {
        over: "mouseover",
        out: "mouseout",
        click: "click"
    },
    touch: {
        over: "touchstart",
        out: "touchend",
        click: "touchstart"
    }
};

let deviceType = "";

// Dokunmatik cihaz tespiti
const isTouchDevice = () => {
    try {
        // TouchEvent oluşturmaya çalışıyoruz (Masaüstü için başarısız olur ve hata fırlatır)
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

isTouchDevice();

starContainers.forEach((element, index) => {
    element.addEventListener(events[deviceType].over, () => {
        hoverRatingUpdate(index); // Üzerine gelindiğinde geçici renklendirme
    });

    element.addEventListener(events[deviceType].out, () => {
        resetHoverRating(); // Üzerinden çıkıldığında geçici renklendirmeyi sıfırla
    });

    element.addEventListener(events[deviceType].click, () => {
        submitButton.disabled = false;
        setRating(index); // Tıklandığında kalıcı renklendirme
    });
});

const hoverRatingUpdate = (end) => {
    resetHoverRating(); // Geçici renklendirmeyi sıfırla
    for (let i = 0; i <= end; i++) {
        starContainers[i].firstElementChild.classList.add("hover");
        starContainers[i].firstElementChild.classList.remove("fa-regular");
        starContainers[i].firstElementChild.classList.add("fa-solid");
    }
    updateMessage(end + 1, true); // Geçici mesajı güncelle
};

const resetHoverRating = () => {
    starContainers.forEach((element) => {
        if (!element.firstElementChild.classList.contains("active")) {
            element.firstElementChild.classList.remove("hover");
            element.firstElementChild.classList.remove("fa-solid");
            element.firstElementChild.classList.add("fa-regular");
        }
    });
    updateMessage(getActiveRating(), false); // Geçerli aktif yıldız sayısına göre mesajı güncelle
};

const setRating = (end) => {
    resetRating(); // Önceki kalıcı renklendirmeyi sıfırla
    for (let i = 0; i <= end; i++) {
        starContainers[i].firstElementChild.classList.add("active");
        starContainers[i].firstElementChild.classList.remove("fa-regular");
        starContainers[i].firstElementChild.classList.add("fa-solid");
    }
    updateMessage(end + 1, false); // Kalıcı mesajı güncelle
};

const resetRating = () => {
    starContainers.forEach((element) => {
        element.firstElementChild.classList.remove("active");
        element.firstElementChild.classList.remove("fa-solid");
        element.firstElementChild.classList.add("fa-regular");
    });
};


//  deneyim değerlendirme Mesajı güncelle
const updateMessage = (rating, isTemporary) => {
    let ratingMessage = "";
    switch (rating) {
        case 1:
            ratingMessage = "Berbat";
            break;
        case 2:
            ratingMessage = "Kötü";
            break;
        case 3:
            ratingMessage = "Ortalama";
            break;
        case 4:
            ratingMessage = "Çok İyi";
            break;
        case 5:
            ratingMessage = "Mükemmel";
            break;
        default:
            ratingMessage = "";
            break;
    }
    if (isTemporary) {
        message.style.opacity = "0.5"; // Geçici mesaj için opaklık ayarı
    } else {
        message.style.opacity = "1"; // Kalıcı mesaj için opaklık ayarı
    }
    message.innerText = ratingMessage;
};

// Aktif yıldız sayısını döndür
const getActiveRating = () => {
    let activeStars = document.querySelectorAll(".star-container .fa-star.active").length;
    return activeStars;
};


// comment-box clear
function clearComment() {
    document.getElementById('comment-input').value = '';
}


// Yorum kutusu karekter sayacı
document.getElementById('comment-input').addEventListener('input', function() {
    var charCount = this.value.length;
    var minChars = 100; // Alt sınırı 
    var maxChars = 400; // Üst sınırı 
    var remainingChars = maxChars - charCount;
    var counterElement = this.parentElement.querySelector('.char-counter');
    
    if (charCount < minChars) {
        counterElement.textContent = (minChars - charCount) + ' karakter daha yazmalısınız!'; 
        counterElement.style.color = 'red'; // 
    } else if (charCount > maxChars) {
        this.value = this.value.substring(0, maxChars); 
        counterElement.textContent = 'Üst sınırı aştınız'; 
        counterElement.style.color = 'red'; 
    } else {
        counterElement.textContent = charCount + '/' + maxChars; 
        counterElement.style.color = '#999';
    }
});



/*Formun geçerliliğini kontrol et: punalama yapmadan, tarih seçmeden veya en az 100 karekterlik yorum yapmada
birini bile yapmadan hepsini doldurması lazım submit butona tıklayamaz !*/

starContainers.forEach(container => {
    container.addEventListener('click', checkFormValidity);
});

dateInput.addEventListener('change', checkFormValidity);

commentInput.addEventListener('input', checkFormValidity);


function checkFormValidity() {
    const dateSelected = dateInput.value !== '';
    const starsSelected = Array.from(starContainers).some(container => {
        return container.querySelector('.fa-star.active') !== null;
    });
    const commentText = commentInput.value.trim().length >= 100 && commentInput.value.trim().length <= 400; // Yorumun en az 100 karakter ve en fazla 400 karakter içermesi gerekiyor
    submitButton.disabled = !(dateSelected && starsSelected && commentText);
}



// Submit butonuna tıklandığında submit-message göster
submitButton.addEventListener("click", () => {
    submitSection.style.display = "block"; 
});


