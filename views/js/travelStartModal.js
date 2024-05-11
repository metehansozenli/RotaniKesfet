var startBtn = document.getElementById("travelStartBtn");
var selectBtn = document.getElementById("select-btn");
var createTravelBtn = document.getElementById("createTravelBtn");


function travelStartBtn() {
    // Butona tıklandığında yapılacak işlemi belirt
    if (1) {
        $('#travelStartModal').modal('show');
        if (!selectBtn.classList.contains("open")) {
            selectBtn.classList.toggle("open");
        }
    } else {
        $('#loginAlert').modal('show');
    }

}


$(document).ready(function () {

    $('.input-daterange').datepicker({
        format: 'dd-mm-yyyy',
        autoclose: true,
        calendarWeeks: true,
        clearBtn: true,
        disableTouchKeyboard: true,
        orientation: 'top'
    });

});

items = document.querySelectorAll(".categoryItems .item");

selectBtn.addEventListener("click", () => {
    selectBtn.classList.toggle("open");
});

items.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("checked");

        let checked = document.querySelectorAll(".checked"),
            btnText = document.querySelector(".btn-text");

        if (checked && checked.length > 0) {
            btnText.innerText = `${checked.length} Seçildi`;
        } else {
            btnText.innerText = "Kategori Seç";
        }
    });
})


const ul = document.querySelector(".seyahatAdiSec ul");
const input = document.querySelector("#destinasyon-tag");
const tagNumb = document.querySelector(".sehirSecDetaylari span");

let maxTags = 5;
let tags = [];

countTags();
createTag();

function countTags() {
    input.focus();
    tagNumb.innerText = maxTags - tags.length;
}

function createTag() {
    ul.querySelectorAll("li").forEach(li => li.remove());
    tags.slice().reverse().forEach(tag => {
        let liTag = `<li>${tag} <i class="uit uit-multiply" onclick="remove(this, '${tag}')"></i></li>`;
        ul.insertAdjacentHTML("afterbegin", liTag);
    });
    countTags();

    input.placeholder = tags.length > 0 ? "" : "Şehir Ekle";
}

function remove(element, tag) {
    let index = tags.indexOf(tag);
    tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
    element.parentElement.remove();
    createTag(); // Taglar güncellendiğinde input alanını da güncelliyoruz
}

function addTag(e) {
    if (e.key == "Enter") {
        let tag = e.target.value.replace(/\s+/g, ' ');
        if (tag.length > 1 && !tags.includes(tag)) {
            if (tags.length < 5) {
                tag.split(',').forEach(tag => {
                    tags.push(tag);
                    createTag();
                });
            }
        }
        e.target.value = "";
    }
}

input.addEventListener("keyup", addTag);

// Butonun class'ını doğru şekilde değiştirdim
const removeBtn = document.querySelector(".sehirSecDetaylari button");
removeBtn.addEventListener("click", () => {
    tags.length = 0;
    ul.querySelectorAll("li").forEach(li => li.remove());
    createTag();
});

const start = document.getElementById("start");
const end = document.getElementById("end");
const seyahatAdi = document.querySelector("#seyahatAdi");

createTravelBtn.addEventListener("click", async() => {
   
            const routeCreationDate = new Date();
            const routeTitle = seyahatAdi.value;
            const routeStartDates = [convertDateFormat(start.value)];
            const routeFinishDates = [convertDateFormat(end.value)];
            const userID = 2;
            
            const routeChoices = await addRouteChoices(items);

           
            console.log(routeChoices);
            // İşaretli şehirlerin seçimini belirle
            const cityIDs = await getCityIDsFromTags(tags);

            // AJAX isteği yap
            const response = await fetch('/createTravel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    routeCreationDate,
                    routeTitle,
                    routeStartDates,
                    routeFinishDates,
                    userID,
                    routeChoices,
                    cityIDs
                })
            });

            // Sunucudan gelen yanıtı al
            const data = await response.json();
            console.log(data);
        
    
});




function getCityIDsFromTags(tags) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    const response = JSON.parse(this.responseText);
                    resolve(response.cityIDs); // Şehir ID'lerini döndür
                } else {
                    reject(new Error('AJAX isteği başarısız oldu')); // Hata durumunda reject
                }
            }
        };
        xhr.open('POST', '/getCityIDs', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ tags: tags }));
    });
}



function convertDateFormat(dateInput) {
    const dateParts = dateInput.split('-');
    const year = parseInt(dateParts[2]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[0]);

    // JavaScript'te Date nesnesi geçerli bir tarih oluşturamazsa NaN (Not a Number) döner
    return new Date(year, month - 1, day);
}


function addRouteChoices(items) {
    return new Promise((resolve, reject) => {
        try {
            const routeChoices = [];
            items.forEach(item => {
                if (item.classList.contains('checked')) {
                    routeChoices.push(1); // İşaretli ise 1 ekle
                } else {
                    routeChoices.push(0); // İşaretli değilse 0 ekle
                }
            });

            resolve(routeChoices);
        } catch (error) {
            reject(error);
        }
    });
}
