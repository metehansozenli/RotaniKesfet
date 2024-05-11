

var j = 1;
var i = 1;
var markers = new Array();

document.addEventListener('DOMContentLoaded', function () {
    citylocation_load_data();
});

const citylocation_load_data = () => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', `/get_citylocationData`);
        request.onload = () => {
            results = JSON.parse(request.responseText);
            let html = '';
            let promises = []; // Asenkron işlemleri takip etmek için bir dizi oluştur

            if (results.length > 0) {
                results.forEach(result => {
                    const request2 = new XMLHttpRequest();
                    request2.open('GET', `/get_typelocationData?locationType=${result.locationType}`);
                    let html2 = ''; // html2'yi içerde tanımla

                    // Asenkron işlemi takip et
                    let promise = new Promise((resolve, reject) => {
                        request2.onload = () => {
                            const results2 = JSON.parse(request2.responseText);
                            results2.forEach(result2 => {
                                html2 +=                                                    `
                                    <li class="item">
                                        <span class="checkbox">
                                            <i class="fa-solid fa-check check-icon"></i>
                                        </span>
                                        <span class="item-text">${result2.locationName}</span>
                                    </li>
                                `;
                            });

                            // html2'yi burada oluşturup, html içine ekle
                            html += `
                                <div class="dropdowns-container">
                                    <div class="calendar-category-container">
                                        <div class="select-btn" id="select-btn">
                                            <span class="btn-text">${result.locationType}</span>
                                            <span class="arrow-dwn">
                                                <i class="fa-solid fa-chevron-down"></i>
                                            </span>
                                        </div>
                                        <ul class="list-items categoryItems checkboxLocations`+ (j++) + `">${html2}</ul>
                                    </div>
                                </div>
                            `;
                            resolve(); // Asenkron işlem tamamlandığında Promise'i çöz
                        };
                        request2.onerror = () => {
                            reject('İkinci istek başarısız');
                        };
                        request2.send();
                    });
                    promises.push(promise); // Promise'i diziye ekle
                });

                // Tüm asenkron işlemler tamamlandığında devam et
                Promise.all(promises).then(() => {
                    dropdownsContainer.innerHTML = dropdownsContainer.innerHTML + html;
                    document.dispatchEvent(new CustomEvent('customDropdownEventListener'));
                    resolve(); // İşlem tamamlandığında Promise'i çöz
                }).catch(error => {
                    reject(error); // Hata oluştuğunda Promise'i reddet
                });
            } else {
                resolve(); // İşlem tamamlandığında Promise'i çöz
            }
        };
        request.onerror = () => {
            reject('İlk istek başarısız');
        };
        request.send();
    });
};




document.addEventListener('customDropdownEventListener', function () {
    var selectBtns = document.querySelectorAll(".select-btn"); // Tüm dropdown seçim düğmelerini seç

    selectBtns.forEach(selectBtn => {
        selectBtn.addEventListener("click", () => {
            selectBtn.classList.toggle("open");
        });

        var items = selectBtn.nextElementSibling.querySelectorAll(".item"); // Her dropdown için öğeleri seç
        items.forEach(item => {
            item.addEventListener("click", () => {
                item.classList.toggle("checked");
                itemText = item.querySelector('.item-text')
                updateMapPin(itemText.innerHTML,item);
                
            });
        });
    });

    // Dropdown düğmesinin metnini güncelleyen yardımcı fonksiyon
    function updateButtonText(btn) {
        let checkedItems = btn.nextElementSibling.querySelectorAll(".checked");
        let btnText = btn.querySelector(".btn-text");

        // if (checkedItems.length > 0) {
        //     btnText.innerText = `${checkedItems.length} Seçildi`;
        // } else {
        //     btnText.innerText = "Puan Seç";
        // }
    }

    const updateMapPin = (itemText,item) => {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', `/get_locationCoordinates?locationName=${itemText}`);
            
            request.onload = () => {
                let marker;
                results = JSON.parse(request.responseText); 
                const locationCoordinatesLat = parseFloat(results.locationCoordinatesLat);
                const locationCoordinatesLong = parseFloat(results.locationCoordinatesLong);

                if(item.classList.contains("checked")){
                    marker = new L.marker([locationCoordinatesLat, locationCoordinatesLong]); 
                    markers.push(marker); 
                    marker.addTo(map);
                    resolve(); // İşlem tamamlandığında Promise'i çöz
                }
                else{
                    let index = markers.findIndex(m => m.getLatLng().lat === locationCoordinatesLat && m.getLatLng().lng === locationCoordinatesLong);
                    if (index !== -1) {
                        map.removeLayer(markers[index]); // Bulunan marker'ı kaldır
                        markers.splice(index, 1); // Diziden marker'ı kaldır
                    }
                    resolve(); // İşlem tamamlandığında Promise'i çöz
                }
                var control = L.Routing.control(L.extend(window.lrmConfig, {
                    waypoints: markers,
                    geocoder: L.Control.Geocoder.nominatim(),
                    routeWhileDragging: true,
                    reverseWaypoints: true,
                    showAlternatives: true,
                    altLineOptions: {
                        styles: [
                            {color: 'black', opacity: 0.15, weight: 9},
                            {color: 'white', opacity: 0.8, weight: 6},
                            {color: 'blue', opacity: 0.5, weight: 2}
                        ]
                    }
                })).addTo(map);
                
                L.Routing.errorControl(control).addTo(map);
            };
    
            request.onerror = () => {
                reject('İstek başarısız');
            };
            request.send();
        });
    }

});


