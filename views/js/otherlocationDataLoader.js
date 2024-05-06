var start_index = 0;
var number_of_record = 5;
var state = true;
let finish = false;
let j = 0;

document.addEventListener('DOMContentLoaded', function () {

   
    document.dispatchEvent(new CustomEvent('customCommentLoadEvent'));
    var restaurant = document.getElementById("restaurant");
    var hotel = document.getElementById("hotel");

    if (restaurant != null) {
        locationType = 'Restoran';

    } else if (hotel != null) {
        locationType = 'Otel';

    }
    otherlocation_load_data(locationType);
});

window.addEventListener('scroll', () => {


    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && state && !finish) {

        var restaurant = document.getElementById("restaurant");
        var hotel = document.getElementById("hotel");

        if (restaurant != null) {
            locationType = 'Restoran';
        } else if (hotel != null) {
            locationType = 'Otel';
        }

        document.getElementById("loading_animation").style.display = "block";
        setTimeout(1000);
        otherlocation_load_data(locationType);


    }
});


const otherlocation_load_data = (locationType) => {
    return new Promise((resolve, reject) => {
        state = false;
        const request = new XMLHttpRequest();
        request.open('GET', `/get_otherlocationData?start_index=${start_index}&num_record=${number_of_record}&locationType=${locationType}`);
        request.onload = () => {
            results = JSON.parse(request.responseText);
            let html = '';
            let html2 = '';

            if (results.length > 0) {
                results.forEach(result => {
                    if (start_index == 0) {
                        html2 += "<section class='otherlocation-section mt-4 d-block'>" +
                            "<img src='" +result.locationImg +"'" +
                            "alt='Keşfet' class='img-fluid d-block mt-5 mx-auto'>" +
                            "<div class='popotherlocations mt-5 d-flex justify-content-between' style='margin: 2% 11%;'>" +
                            "<div class='text-left'>" +
                            '<h2 class="otherlocation-rank mx-3" >#' + (++j) + '</h2>' +
                            ' <h2 class="otherlocation-title mx-3" style="width:400px;">' + "<a href='/location?id="+ result.locationID + "'>"+ result.locationName +"</a> </h2>" +
                                '<div class="popotherlocation-loc mb-2 d-flex"><img src="../images/location.png" />' +
                                '<p>' + result.cityName + ', ' + result.locationCountry + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    "<div class='otherlocation d-blok mr-4'>" +
                                    '<div class="otherlocation-fav d-flex ">' +
                                    ' <div onclick="checkSessionForcommentWrite(' + result.locationID + ')" class="write-comment text-bold">Yorum Yazın</div>' +
                                    "<div class='large-font'>" +
                                    '<ion-icon name="heart">' +
                                    "</ion - icon >" +
                                    "</div>" +

                                    " </div>" +
                                    '<div class="point-section d-block">' +
                                    '<div class="d-flex">' +
                                    '<h5 class="point">' + result.locationScore + '</h5>' +
                                    '<div class="ratings">' +
                                    '<i class="fa fa-star"></i>'.repeat(5) +
                                    "</div>"+
                                    "<h5 class='review-count d-flex'>" + result.locationCommentCount + " Yorum</h5>" + 
                                    " </div>"+
                                    " </div>"+
                                    " </div>"+
                                    "</div>"+
                                    "</section>";

                        popotherlocation_data.innerHTML = popotherlocation_data.innerHTML + html2;
                    } else {
                        html +=
                            "<section class='otherlocation-section mt-4 d-flex justify-content-between'>" +
                            "<div class='otherlocations-context d-flex'>" +
                            " <img src='" + result.locationImg + "' alt='Keşfet' class='locationImg img-fluid'>" +
                            "<div class='otherlocations-text'>" +
                            "<h2 class='otherlocation-rank mx-3'>#" + (++j) + "</h2>" +
                            "<h2 class='otherlocation-title mx-3'>" + "<a href='/location?id="+ result.locationID + "'>"+ result.locationName +"</a></h2>"+
                            "<div class='point-section'>" +
                            "<div class='d-flex'>" +
                            " <h5 class='point'>" + result.locationScore + "</h5>" +
                            "<div class='ratings d-flex'>" +
                            '<i class="fa fa-star"></i>'.repeat(5) +
                            "</div>" +
                            "<h5 class='review-count d-flex'>" + result.locationCommentCount + " Yorum</h5>" +
                            "</div>" +
                            "</div>" +
                            "<div class='otherlocations-loc mb-2 d-flex'><img src='../images/location.png' />" +
                            "<p>" + result.cityName + ", " + result.locationCountry + "</p>" +
                            "</div>" +
                            " </div>" +
                            "</div>" +
                            "<div class='other-locations d-flex mr-4'>" +
                            "<div onclick='checkSessionForcommentWrite(" + result.locationID + ")' class='write-comment text-bold'>Yorum Yazın</div>" +
                            "<div class='large-font text-center top-20'>" +
                            "<ion-icon name='heart'></ion-icon>" +
                            "</div>" +
                            "</div>" +
                            "</section>"
                            ;
                    }
                    start_index++;

                });
                otherlocations_data.innerHTML = otherlocations_data.innerHTML + html;
                document.dispatchEvent(new CustomEvent('customLoadEvent'));
                favControl();
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




