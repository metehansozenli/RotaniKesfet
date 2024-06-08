let starContainers = document.querySelectorAll(".star-container");
const submitButton = document.querySelector("#submit");
const message = document.querySelector("#message");
const dateInput = document.getElementById('date');
const commentInput = document.getElementById('comment-input');
const commentTitleInput = document.getElementById('title-input');
const submitSection = document.querySelector("#submit-section");
const locationID = getLocationIdFromUrl();

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


// Yorum kutusu karakter sayacı
document.getElementById('comment-input').addEventListener('input', function() {
    var inputValue = this.value.trim(); // Başta ve sonda boşlukları sil
    var charCount = inputValue.replace(/\s/g, '').length; // Tüm boşlukları silerek karakter sayısını al
    var minChars = 100; // Alt sınırı 
    var maxChars = 400; // Üst sınırı 
    var remainingChars = maxChars - charCount;
    var counterElement = this.parentElement.querySelector('.char-counter');
    
    if (charCount < minChars) {
        counterElement.textContent = (minChars - charCount) + ' karakter daha yazmalısınız!'; 
        counterElement.style.color = 'red'; 
    } else if (charCount > maxChars) {
        this.value = this.value.substring(0, maxChars); 
        counterElement.textContent = 'Üst sınırı aştınız'; 
        counterElement.style.color = 'red'; 
    } else {
        counterElement.textContent = charCount + '/' + maxChars; 
        counterElement.style.color = '#999';
    }
});


// Yorum kutusunu temizle
function clearContextComment() {
    document.getElementById('comment-input').value = '';
    document.querySelector('.char-counter').textContent = '0/100';
    document.querySelector('.char-counter').style.color = '#999';
}


// title fonksiyonlari

document.getElementById('title-input').addEventListener('input', function() {
    var inputValue = this.value.replace(/ /g, ''); // Boşlukları hariç tut
    var maxChars = 120;
    var charCount = inputValue.length;

    var counterElement = document.getElementById('title-counter');
    if (charCount > maxChars) {
        this.value = this.value.substring(0, maxChars);
        counterElement.textContent = 'Üst sınırı aştınız!';
        counterElement.style.color = 'red';
    } else {
        counterElement.textContent = charCount + '/' + maxChars;
        counterElement.style.color = '#999';
    }
});

document.getElementById('title-input').addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Enter tuşuna basıldığında varsayılan davranışı engelle
    }
});

document.getElementById('title-input').addEventListener('input', adjustInputWidth);

function adjustInputWidth() {
    const input = this;
    const closeIconWidth = 40; // Kapatma simgesi ve padding için tahmini genişlik
    const containerWidth = input.parentNode.offsetWidth; // Ana konteynerin genişliği
    const maxWidth = containerWidth - closeIconWidth; // Maksimum kullanılabilir genişlik

    input.style.width = maxWidth + 'px'; // Metin kutusunun genişliğini ayarla
}

// Çarpı simgesine basıldığında içeriği temizle ve sayacı sıfırla
document.querySelector('.close-icon').addEventListener('click', function() {
    var input = document.getElementById('title-input');
    var counterElement = document.getElementById('title-counter');
    input.value = ''; // İçeriği temizle
    counterElement.textContent = '0/' + 120;
    counterElement.style.color = '#999';
});

// title-box temizle
function clearTitleComment() {
    document.getElementById('title-input').value = '';
    document.querySelector('.char-counter').textContent = '0/100';
    document.querySelector('.char-counter').style.color = '#999';
}



/* Formun geçerliliğini kontrol et: Puanlama yapmadan, tarih seçmeden, en az 20 karakterlik yorum yapmadan,
   veya en az 10 karakterlik başlık koymadan birini bile yapmadan hepsini doldurması lazım submit butona tıklayamaz! */

// Yıldız puanlama konteynerleri için olay dinleyicileri ekle
starContainers.forEach(container => {
    container.addEventListener('click', checkFormValidity);
});

// Tarih girişi ve yorum girişleri için olay dinleyicileri
dateInput.addEventListener('change', checkFormValidity);
commentInput.addEventListener('input', checkFormValidity);
commentTitleInput.addEventListener('input', checkFormValidity); // Başlık girişi için olay dinleyicisi

var dateSelected;
var starsSelected;
var commentText;
var commentTitle;

function checkFormValidity() {
    dateSelected = dateInput.value !== '';
    starsSelected = Array.from(starContainers).some(container => {
        return container.querySelector('.fa-star.active') !== null;
    });
    commentText = commentInput.value.trim().length >= 20 && commentInput.value.trim().length <= 400; // Yorumun en az 20 karakter ve en fazla 400 karakter içermesi gerekiyor
    commentTitle = commentTitleInput.value.trim().length >= 5; // Başlığın en az 10 karakter olması gerekiyor

    // Tüm koşullar sağlandığında submit butonunu etkinleştir
    submitButton.disabled = !(dateSelected && starsSelected && commentText && commentTitle);
}


// Submit butonuna tıklandığında submit-message göster
submitButton.addEventListener("click", () => {
    commentText = commentInput.value
    commentTitle = commentTitleInput.value;
    dateSelected = dateInput.value
    starsSelected = parseFloat(getActiveRating()).toFixed(1)

    const request = new XMLHttpRequest();
    request.open('GET', `/commentInsert?locationID=${locationID}&commentContents=${commentText}&commentDate=${dateSelected}&commentTitle=${commentTitle}&commentScore=${starsSelected}`);
    request.onload = () => {{}};
    request.onerror = () => {
        reject('İstek başarısız');
    };
   


    // Yorum başarıyla gönderildikten sonra mesajı göster ve yönlendir
    submitSection.classList.remove("hide");
    submitSection.classList.add("show");
   
    request.send();

    // 2 saniye sonra yönlendir
    setTimeout(() => {
        
        window.location.href = `/location?id=${locationID}`;
    }, 1000);
    
});


