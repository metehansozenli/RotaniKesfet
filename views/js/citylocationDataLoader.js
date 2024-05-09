var j = 1;
var i = 1;

document.addEventListener('DOMContentLoaded', function () {
    citylocation_load_data().then(() => {
        console.log(dropdownsContainer.innerHTML);
    }).catch(error => {
        console.error('citylocation_load_data fonksiyonunda bir hata oluştu:', error);
    });
});
const citylocation_load_data = () => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', `/get_citylocationData`);
        request.onload = () => {
            results = JSON.parse(request.responseText);
            let html = '';
            let html2 = '';
            
            if (results.length > 0) {
                results.forEach(result => {
                    const request2 = new XMLHttpRequest();
                    request2.open('GET', `/get_typelocationData?locationType=${result.locationType}`);
                    request2.onload = () => {
                        const results2 = JSON.parse(request2.responseText);
                        const list = ".checkboxLocations"+(i++);
                        const listItems = document.querySelector(list);
                        results2.forEach(result2 => {
                            html2 += `
                                <li class="item">
                                    <span class="checkbox">
                                        <i class="fa-solid fa-check check-icon"></i>
                                    </span>
                                    <span class="item-text">${result2.locationName}</span>
                                </li>
                            `;
                        });
                    };
                    request2.onerror = () => {
                        reject('İkinci istek başarısız');
                    };
                    request2.send();
                    
                    html += `
                        <div class="dropdowns-container">
                            <div class="calendar-category-container">
                                <div class="select-btn" id="select-btn">
                                    <span class="btn-text">${result.locationType}</span>
                                    <span class="arrow-dwn">
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </span>
                                </div>
                                <ul class="list-items categoryItems checkboxLocations`+ (j++) +`">`+ html2 +`</ul>
                            </div>
                        </div>
                    `;
                    
                });
                dropdownsContainer.innerHTML = dropdownsContainer.innerHTML + html;
                document.dispatchEvent(new CustomEvent('customDropdownEventListener'));
                resolve(); // İşlem tamamlandığında Promise'i çöz
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
    var selectBtn = document.querySelectorAll("#select-btn")
    selectBtn.forEach(selectBtnElements => {
        
        items = document.querySelectorAll("#tuna");
        items.forEach(item => {
            item.addEventListener("click", () => {
                item.classList.toggle("checked");

                let checked = document.querySelectorAll(".calendar-category-container .checked"),
                    btnText = document.querySelector(".btn-text");

                if (checked && checked.length > 0) {
                    btnText.innerText = `${checked.length} Seçildi`;
                } else {
                    btnText.innerText = "Puan Seç";
                }
            });
        })
        selectBtnElements.addEventListener("click", () => {
        selectBtnElements.classList.toggle("open");
        });
    });
    
});

