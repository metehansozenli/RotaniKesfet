document.addEventListener("DOMContentLoaded", function() {
    var items = document.querySelectorAll(".categoryItems .item");
    var selectBtn = document.getElementById("select-btn");
    var selectBtn2 = document.getElementById("select-btn2");

    selectBtn.addEventListener("click", function() {
        selectBtn.classList.toggle("open");
    });

    selectBtn2.addEventListener("click", function() {
        selectBtn2.classList.toggle("open");
    });

    items.forEach(function(item) {
        item.addEventListener("click", function() {
            item.classList.toggle("checked");

            var checked = document.querySelectorAll(".checked");
            var btnText = document.querySelector(".btn-text");

            if (checked && checked.length > 0) {
                btnText.innerText = `${checked.length} Seçildi`;
            } else {
                btnText.innerText = "Kategori Seç";
            }
        });
    });
});

const popdest_load_data = () => {
    return new Promise((resolve, reject) => {
        state = false;
        const request = new XMLHttpRequest();
        request.open('GET', `/get_cityLocationData?start_index=${start_index}&num_record=${number_of_record}`);
        request.onload = () => {
            results = JSON.parse(request.responseText);
            let html = '';
            let html2 = '';

            if (results.length > 0) {
                results.forEach(result => {
                    let locationHTML = ""; 
                    if (result.locationNames && result.locationNames.length > 0 && result.locationIDs && result.locationIDs.length > 0) {
                        for (let i = 0; i < 5; i++) {
                            locationHTML += "<li><a href='/location?id=" + result.locationIDs[i] + "'>" + result.locationNames[i] + "</a></li>";
                        }
                    }
                    if (start_index == 0) {
                        html2 += '<section class="popdest-section mt-4 d-block">' +
                            '<img src="' + result.cityImg + '" alt="Keşfet" class="img-fluid d-block mt-5 mx-auto">' +
                            '<div class="ppopdests mt-5 d-flex justify-content-between" style="margin: 2% 11%;">' +
                            '<div class="text-left">' +
                            '<h2 class="city-rank mx-3">#' + ++j + '</h2>' +
                            '<h2 class="city-title mx-3">' + result.cityName + '</h2>' +
                            '<ol class="dest">' +
                            locationHTML + 
                            '</ol>' +
                            '</div>' +
                            '<div class="point-section justify-content-between d-block">' +
                            '<div class="d-flex">' +
                            '<h5 class="point">' + result.cityScore + '</h5>' +
                            '<div class="ratings">' +
                            '<i class="fa fa-star"></i>'.repeat(5) +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</section>';

                        ppopdest_data.innerHTML = ppopdest_data.innerHTML + html2;
                    } else {
                        html += "<section class='popdest-section mt-4  d-flex justify-content-between'><div class='popdests-context d-flex'><img src='" +
                            result.cityImg + "' alt='Keşfet' class='cityImg img-fluid'>" +
                            "<div class='popdests-text'>" +
                            "<h2 class='city-rank mx-3'>#" + (++j) + "</h2>" +
                            "<h2 class='city-title mx-3'>" + result.cityName + "</h2>" +
                            "<ol class='dest'>" +
                            locationHTML + 
                            "</ol>" +
                            "</div>" +
                            "</div>" +
                            '<div class="popdests">' +
                            '<div class="point-section">' +
                            '<div class="d-flex">' +
                            '<h5 class="point ">' + result.cityScore + '</h5>' +
                            '<div class="ratings d-flex">' +
                            '<i class="fa fa-star"></i>'.repeat(5) +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            "</section>";
                    }
                    start_index++;
                });
                popdests_data.innerHTML = popdests_data.innerHTML + html;
                document.dispatchEvent(new CustomEvent('customLoadEvent'));
                document.getElementById("loading_animation").style.display = "none";
                state = true;
                resolve(); // İşlem tamamlandığında Promise'i çöz
            } else {
                finish = true;
                document.getElementById("loading_animation").style.display = "none";
                resolve(); // İşlem tamamlandığında Promise'i çöz
            }
        };
        request.onerror = () => {
            reject('İstek başarısız');
        };
        request.send();

        
    });
};