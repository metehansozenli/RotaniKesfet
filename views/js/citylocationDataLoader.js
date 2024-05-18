var j = 1;
var i = 1;
var markers = new Array();
var routeID = window.routeID;
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
                            const responseData = JSON.parse(request2.responseText);
                            const results2 = responseData.locationNames;
                            const results3 = responseData.locationNamesActive;
                            const locationNames = results3.map(o => o.locationName)
                            results2.forEach(result2 => {
                                let isChecked = false; // Öğe varsayılan olarak işaretlenmemiş olsun
                            
                                if (locationNames.includes(result2.locationName)) {
                                    isChecked = true;
                                    initMapPins(result2.locationName);
                                }

                                html2 +=  
                                    `
                                        <li class="item ${isChecked ? 'checked' : ''}">
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
                updateStatus(item); 
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
    
    const updateStatus = (item) => {
        item.classList.toggle("checked");
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
                    var location = L.latLng(locationCoordinatesLat, locationCoordinatesLong);
                    map.flyTo(location, 13)
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
            };
    
            request.onerror = () => {
                reject('İstek başarısız');
            };
            request.send();
        });
    }

});

const initMapPins = (locationName) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', `/get_locationCoordinates?locationName=${locationName}`);
        //request.open('GET', `/get_locationCoordinates?locationName=${locationName}`);
        request.onload = () => {
            let marker;
            resultsLocation = JSON.parse(request.responseText); 
            const locationCoordinatesLat = parseFloat(resultsLocation.locationCoordinatesLat);
            const locationCoordinatesLong = parseFloat(resultsLocation.locationCoordinatesLong);
            marker = new L.marker([locationCoordinatesLat, locationCoordinatesLong]); 
            markers.push(marker); 
            marker.addTo(map);
            resolve(); // İşlem tamamlandığında Promise'i çöz
            
        };

        request.onerror = () => {
            reject('İstek başarısız');
        };
        request.send();
    });

}

const getLocationID = (locationName) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', `/get_locationCoordinates?locationName=${locationName}`);
        request.onload = () => {
            resultsLocation = JSON.parse(request.responseText); 
            const locationID = resultsLocation.locationID;
            resolve(locationID); // İşlem tamamlandığında Promise'i çöz   
        };

        request.onerror = () => {
            reject('İstek başarısız');
        };
        request.send();
    });

}

btn_update.addEventListener("click", async () => {
    const selectBtns = document.querySelectorAll(".select-btn");
    const routeLocationsPromises = []; // Tüm getLocationID promise'lerini saklamak için dizi
    const routeChoices = []; 

    selectBtns.forEach((selectBtn, index) => {
        const items = selectBtn.nextElementSibling.querySelectorAll(".item"); // Her dropdown için öğeleri seç
        items.forEach(item => {
            if(item.classList.contains("checked")){
                const itemText = item.querySelector('.item-text').innerHTML;
                // getLocationID promise'ini diziye ekle NOT: sunucu tarafında görünmeme sorunun 
                //çözmek için tüm promisler beklenmeli
                routeLocationsPromises.push(getLocationID(itemText).then((locationID) => {
                    return locationID; // resolve edilen değeri döndür
                }).catch((error) => {
                    console.error('Hata:', error);
                    return null; // Hata durumunda null döndür
                }));
            }
        });
        
        const checkedItems = selectBtn.nextElementSibling.querySelectorAll(".checked");
        if (checkedItems.length > 0) {
            routeChoices[index] = true;
        } else {
            routeChoices[index] = false;
        }
    });

    // Tüm getLocationID promise'lerinin sonuçlarını bekleyin
    const routeLocations = await Promise.all(routeLocationsPromises);

    // Sunucuya veri gönder
    const response = await fetch('/updateTravel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            routeLocations: routeLocations.filter(locationID => locationID !== null), // null olmayanları filtrele
            routeChoices,
            routeID: routeID 
        })
    });

    // Sunucudan gelen yanıtı al
    await response.json();
    window.location.href = `/`;
});
