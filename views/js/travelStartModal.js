var startBtn = document.getElementById("travelStartBtn");
var selectBtn = document.getElementById("select-btn");
var createTravelBtn = document.getElementById("createTravelBtn");
var city_names = ["Kopenhag", "Cenevre", "Moskova", "Sevilla", "Frankfurt", "Münih", "Kiev", "Valencia", "Bilbao", "Madrid", "Marsilya", "Milano", "Napoli", "Nice", "Palermo", "Amsterdam", "Berlin", "Brüksel", "Budapeşte", "Helsinki", "Venedik", "Vilnius", "Hamburg", "Floransa", "Londra", "Oslo", "Riga", "Viyana", "Zürih", "Dublin", "Barselona", "Stockholm", "St. Petersburg", "Paris", "Roma", "Krakow", "Tallinn", "Prag", "Lizbon"];
var locationTypeCounts;
var selectedLocationCount = 0;
var spesificLocationCount = {};

async function getLocationTypeCount() {
    try {
        const response = await fetch('/get_locationTypeCount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Burada veriyi kullanabilirsiniz
        return data; // Veriyi döndür
    } catch (error) {
        console.error('Veri çekme hatası:', error);
        return null; // Hata durumunda null döndür
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    if (window.userID) {
        const data = await getLocationTypeCount();
        locationTypeCounts = data.locationTypeCData;
    }
});


function travelStartBtn() {
    // Butona tıklandığında yapılacak işlemi belirt
    if (window.userID) {
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

        const destinationCities = [];
        const categoryName = item.textContent.trim();

        var destinasyon = document.querySelectorAll(".destinasyon-list li");
        if (destinasyon.length === 0) {
            alert("Lütfen en az bir Destinasyon girin.");
            return false;
        }

        const isChecked = item.classList.contains("checked");

        destinasyon.forEach(li => {
            destinationCities.push(li.textContent.trim());
        });

        // locationTypeCounts içerisinde locationName özelliğini ara
        const foundLocations = locationTypeCounts.filter(location => destinationCities.includes(location.cityName));

        // Eğer bulunan bir lokasyon varsa yapılacak işlemleri gerçekleştir
        if (foundLocations.length > 0) {
            // Bulunan lokasyonların adını konsola yazdır
            foundLocations.forEach(foundLocation => {
                if (foundLocation.locationType == categoryName) {

                    if (!spesificLocationCount[foundLocation.cityName]) {
                        spesificLocationCount[foundLocation.cityName] = 0;
                    }

                    if (!isChecked) {
                        selectedLocationCount += parseInt(foundLocation.count);
                        spesificLocationCount[foundLocation.cityName] += parseInt(foundLocation.count);

                    } else {
                        selectedLocationCount -= parseInt(foundLocation.count);
                        spesificLocationCount[foundLocation.cityName] -= parseInt(foundLocation.count);


                    }
                    var locationCountID = document.getElementById(foundLocation.cityName);
                    locationCountID.innerHTML = `<img src="../images/location.png">&nbsp&nbsp${foundLocation.cityName}: ${spesificLocationCount[foundLocation.cityName]}`;

                }
            });
        } else {
            console.log("Destinasyonda bulunan herhangi bir lokasyon bulunamadı.");
        }

        item.classList.toggle("checked");

        let checked = document.querySelectorAll(".checked"),
            btnText = document.querySelector(".btn-text");

        if (checked && checked.length > 0) {
            btnText.innerText = `${selectedLocationCount} Lokasyon Seçildi`;
        } else {
            btnText.innerText = "Kategori Seç";
        }
    });
})




function computeLocationCounts(cityName, add, all) {
    const checkedItems = document.querySelectorAll(".checked");
    const foundLocations = locationTypeCounts.filter(location => location.cityName.includes(cityName));

    checkedItems.forEach(item => {
        const categoryName = item.textContent.trim();
        if (foundLocations.length > 0) {
            // Bulunan lokasyonların adını konsola yazdır
            foundLocations.forEach(foundLocation => {

                if (!spesificLocationCount[cityName]) {
                    spesificLocationCount[cityName] = 0;
                }

                if (foundLocation.locationType == categoryName) {
                    if (add) {

                        selectedLocationCount += parseInt(foundLocation.count);
                        spesificLocationCount[cityName] += parseInt(foundLocation.count);

                    } else {
                        selectedLocationCount -= parseInt(foundLocation.count);
                        spesificLocationCount[cityName] -= parseInt(foundLocation.count);


                    }

                }
            });
        } else {
            console.log("Destinasyonda bulunan herhangi bir lokasyon bulunamadı.");
        }

        btnText = document.querySelector(".btn-text");
        if (tags.length === 0 && !add && !all) {
            item.classList.toggle("checked");
            btnText.innerText = "Kategori Seç";
        }


        btnText.innerText = `${selectedLocationCount} Lokasyon Seçildi`;
    });

}



const ul = document.querySelector(".seyahatAdiSec ul");
const input = document.querySelector("#destinasyon-tag");
const tagNumb = document.querySelector(".sehirSecDetaylari span");
const calendar = document.querySelector(".calendar");

let maxTags = 5;
let tags = [];
let i = 2;
countTags();

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
    if (tags.length >= 1) {
        addDatePicker();
    }

    input.placeholder = tags.length > 0 ? "" : "Şehir Ekle";
}

function addDatePicker() {
    if (tags.length == 1) {
        document.getElementById("labelstart").classList.add("visible");
        document.getElementById("labelend").classList.add("visible");
    }

    var i = tags.length;
    var html =
        `<div class="input-group input-daterange d-flex" id="calendar${i}">
            <div class="travel-date">
                <span class="fa fa-calendar" id="fa-1"></span>
                <input type="text" id="start${i}" class="form-control text-right mr-2">
            </div>

            <div class="travel-date d-block">
                <span class="fa fa-calendar" id="fa-2"></span>
                <input type="text" id="end${i}" class="form-control text-right">
            </div>
        </div>`;

    calendar.insertAdjacentHTML("beforeend", html);

    $('.input-daterange').each(function () {
        $(this).datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true,
            calendarWeeks: true,
            clearBtn: true,
            disableTouchKeyboard: true,
            orientation: 'top'
        });
    });
}


function remove(element, tag) {
    let index = tags.indexOf(tag);
    tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
    element.parentElement.remove();

    if (tags.length == 0) {
        document.getElementById("labelstart").classList.remove("visible");
        document.getElementById("labelend").classList.remove("visible");
    }


    var locationCounts = document.getElementById("locationCounts");
    var pElement = locationCounts.querySelector("#" + tag); // locationCounts içindeki tag ID'sine sahip p elementini seçer
    var pElements2 = locationCounts.getElementsByTagName("h5");
    if (pElement) {
        pElement.parentNode.removeChild(pElement); // Seçilen p elementini kaldırır
    }
    
   
    if(tags.length==0){
        locationCounts.removeChild(pElements2[0]);
        locationCounts.style.display = "none"; 
    }

    var i = index + 1;
    var calendarId = `#calendar${i}`;

    // İlgili calendar'ı kaldır
    $(calendarId).remove();

    // Silinen calendar'ın index'inden sonraki tüm calendar'ların id'lerini ve inputların id'lerini güncelle
    for (var j = i + 1; j <= tags.length + 1; j++) {
        var updatedCalendarId = `#calendar${j}`;
        $(updatedCalendarId).attr("id", `calendar${j - 1}`);
        var updatedStartId = `#start${j}`;
        var updatedEndId = `#end${j}`;
        $(updatedStartId).attr("id", `start${j - 1}`);
        $(updatedEndId).attr("id", `end${j - 1}`);

    }

    countTags();
    computeLocationCounts(tag, false, false);
    delete spesificLocationCount[tag];

}

function addTag(e) {
    if (e.key == "Enter") {
        let tag = e.target.value.replace(/\s+/g, ' ');
        if (tag.length > 1 && !tags.includes(tag) && city_names.includes(tag)) {
            if (tags.length < 5) {
                tag.split(',').forEach(tag => {
                    tags.push(tag);
                    createTag();
                });
            }
        }
        

        var locationCountsID = document.getElementById("locationCounts")


        if(e.target.value != "" && tags.length>0){
        if(tags.length==1){
            locationCounts.style.display = "block"; 
            locationCountsID.innerHTML += `<h5 id="lokasyonTitle">Lokasyon Sayıları</h5>`;
        }

        if (tags.length > 0) {
            computeLocationCounts(tag, true, false)

      
        }
    
        if(spesificLocationCount[tag]){
            locationCountsID.innerHTML += `<p id="${tag}"><img src="../images/location.png">&nbsp&nbsp${tag}: ${spesificLocationCount[tag]}</p>`;
        }else{
            locationCountsID.innerHTML += `<p id="${tag}"><img src="../images/location.png">&nbsp&nbsp${tag}: 0</p>`;
        }
    
    
    
    }
        e.target.value = "";

        

       
        



    }
}

input.addEventListener("keyup", addTag);

// Butonun class'ını doğru şekilde değiştirdim
const removeBtn = document.querySelector(".sehirSecDetaylari button");
removeBtn.addEventListener("click", () => {
    const checkedItems = document.querySelectorAll(".checked");
    ul.querySelectorAll("li").forEach(li => li.remove());
    for (var j = 1; j <= tags.length; j++) {
        var calendarId = `#calendar${j}`;
        $(calendarId).remove();
        computeLocationCounts(tags[j - 1], false, true);
    }

    for (let key in spesificLocationCount) {
        delete spesificLocationCount[key];
    }

    checkedItems.forEach(item => {
        item.classList.toggle("checked");
    });

    var locationCounts = document.getElementById("locationCounts");
    var pElements = locationCounts.getElementsByTagName("p");
    var pElements2 = locationCounts.getElementsByTagName("h5");

    
    locationCounts.removeChild(pElements2[0]);
    locationCounts.style.display = "none"; 
    // Dizi gibi davranarak tüm p elementlerini sil
    while (pElements[0]) {
        locationCounts.removeChild(pElements[0]);
    }

    

    document.getElementById("labelstart").classList.remove("visible");
    document.getElementById("labelend").classList.remove("visible");

    tags.length = 0;

    btnText = document.querySelector(".btn-text");
    btnText.innerText = "Kategori Seç";

    createTag();
});

const start = document.getElementById("start");
const end = document.getElementById("end");
const seyahatAdi = document.querySelector("#seyahatAdi");

createTravelBtn.addEventListener("click", async () => {
    const routeCreationDate = new Date();
    const routeTitle = seyahatAdi.value;
    const routeStartDates = [];
    const routeFinishDates = []
    const userID = window.userID

    if (!validateForm()) return;

    // Her bir tag için tarih eklemek için döngü kullanma
    for (let i = 1; i <= tags.length; i++) {
        // Her bir tarih değerini uygun formata dönüştürerek ekleyin
        const startId = `start${i}`;
        const endId = `end${i}`;
        routeStartDates.push(convertDateFormat(document.getElementById(startId).value));
        routeFinishDates.push(convertDateFormat(document.getElementById(endId).value));
    }

    const routeChoices = await addRouteChoices(items);

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
    result = await response.json();
    routeID = result.newRouteID;
    window.location.href = `/routePlanner?routeID=${routeID}`;

});



function validateForm() {
    var seyahatAdi = document.getElementById("seyahatAdi").value;
    var destinasyon = document.querySelectorAll(".destinasyon-list li").length;
    let checked = document.querySelectorAll(".checked").length;
    var travelDates = document.querySelectorAll('.travel-date input');


    if (seyahatAdi === "") {
        alert("Lütfen Seyahat Adını girin.");
        return false;
    }
    if (destinasyon === 0) {
        alert("Lütfen en az bir Destinasyon girin.");
        return false;
    }
    if (checked < 2) {
        alert("Lütfen en az iki tane kategori seçiniz.");
        return false;
    }
    for (var input of travelDates) {
        if (input.value === "") {
            alert("Lütfen tüm tarih alanlarını doldurun.");
            return false;
        }
    }

    var previousEndDate = null;
    var currentDate = new Date(); // Current date

    for (var i = 0; i < travelDates.length; i += 2) {
        var startDate = travelDates[i].value;
        var endDate = travelDates[i + 1].value;

        if (startDate === "" || endDate === "") {
            alert("Lütfen tüm tarih alanlarını doldurun.");
            return false;
        }

        var start = new Date(startDate.split('-').reverse().join('-'));
        var end = new Date(endDate.split('-').reverse().join('-'));

        if (start < currentDate || end < currentDate) {
            alert("Seyahat tarihleri geçmiş bir tarih olamaz.");
            return false;
        }

        if (previousEndDate) {
            var prevEnd = new Date(previousEndDate.split('-').reverse().join('-'));
            if (start <= prevEnd) {
                alert("Tarihleri kontrol edin: Yeni seyahatin başlangıcı, önceki seyahatin bitişinden sonra olmalı.");
                return false;
            }
        }
        previousEndDate = endDate;
    }

    if (selectedLocationCount == 0) {
        alert(selectedLocationCount)
        alert("Seçili lokasyon sayısı 0. Lütfen başka kategorileri seçiniz.");
        return false;
    }

    for (var i = 0, j = 0; i < travelDates.length; i += 2, j++) {
        var startDate = new Date(travelDates[i].value.split('-').reverse().join('-'));
        var endDate = new Date(travelDates[i + 1].value.split('-').reverse().join('-'));
        const values = Object.values(spesificLocationCount);
        const cityLocationCount = values;

        var diffTime = Math.abs(endDate - startDate);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const count = cityLocationCount[j];
        if (count < diffDays) {
            alert("Lokasyon sayısı, seyahat tarihleri arasındaki gün sayısından az olamaz.");
            return false;
        }
    }

    return true;
}



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




// const get_cities = () => {
//     return new Promise((resolve, reject) => {
//         const request = new XMLHttpRequest();
//         request.open('GET', `/get_Cities`);

//         request.onload = () => {
//             results = JSON.parse(request.responseText);
//             city_names =results

//             resolve(); // İşlem tamamlandığında Promise'i çöz

//         };

//         request.onerror = () => {
//             reject('İstek başarısız');
//         };
//         request.send();
//     });
// }
// Kullanımı

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-list");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-list");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

autocomplete(document.getElementById("destinasyon-tag"), city_names);


