var startBtn = document.getElementById("travelStartBtn");
var selectBtn = document.getElementById("select-btn");
var createTravelBtn = document.getElementById("createTravelBtn");
var city_names = ["Kopenhag", "Cenevre", "Moskova", "Sevilla", "Frankfurt", "Münih", "Kiev", "Valencia", "Bilbao", "Madrid", "Marsilya", "Milano", "Napoli", "Nice", "Palermo", "Amsterdam", "Berlin", "Brüksel", "Budapeşte", "Helsinki", "Venedik", "Vilnius", "Hamburg", "Floransa", "Londra", "Oslo", "Riga", "Viyana", "Zürih", "Dublin", "Barselona", "Stockholm", "St. Petersburg", "Paris", "Roma", "Krakow", "Tallinn", "Prag", "Lizbon"];



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
            <div>
                <span class="fa fa-calendar" id="fa-1"></span>
                <input type="text" id="start${i}" class="form-control text-right mr-2">
            </div>

            <div class="d-block">
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
        e.target.value = "";
    }
}

input.addEventListener("keyup", addTag);

// Butonun class'ını doğru şekilde değiştirdim
const removeBtn = document.querySelector(".sehirSecDetaylari button");
removeBtn.addEventListener("click", () => {
    
    ul.querySelectorAll("li").forEach(li => li.remove());
    for (var j = 1; j <= tags.length ; j++) {
        var calendarId = `#calendar${j}`;
        $(calendarId).remove();
    }

    document.getElementById("labelstart").classList.remove("visible");
    document.getElementById("labelend").classList.remove("visible");
    
    tags.length = 0;
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
    result=await response.json();
    routeID=result.newRouteID;
    window.location.href = `/routePlanner?routeID=${routeID}`;

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
    inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
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
          b.addEventListener("click", function(e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });

    inp.addEventListener("keydown", function(e) {
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
