var start_index = 0;
var number_of_record = 5;
var state = true;
let finish = false;
let j = 0;
var locationID;


document.addEventListener('DOMContentLoaded', function () {
    document.dispatchEvent(new CustomEvent('customLoadEvent'));
    locationID=getIdFromUrl();
    locationcomment_load_data(locationID);
});

window.addEventListener('scroll', () => {



    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && state && !finish) {

        document.getElementById("loading_animation").style.display = "block";
        setTimeout(1000);
        locationcomment_load_data(locationID); 
    }
});

function getIdFromUrl() {
    var url = window.location.href;
    var id = null;

    // URL'yi parçalara ayırın
    var urlParts = url.split('?');

    // URL parçalarını kontrol edin
    if (urlParts.length > 1) {
        // Parametreleri alın
        var params = urlParts[1].split('&');
        
        // Parametreleri döngüye alın ve "id" parametresini bulun
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if (param[0] === 'id') {
                id = param[1];
                break;
            }
        }
    }

    return id;
}

const locationcomment_load_data = (locationID) => {
    return new Promise((resolve, reject) => {
        
        state = false;
        var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

        const request = new XMLHttpRequest();
        request.open('GET', `/get_locationcommentData?start_index=${start_index}&num_record=${number_of_record}&locationID=${locationID}`);

        request.onload = () => {
            results = JSON.parse(request.responseText);  


            let html = '';
            if (results.length > 0) {
                results.forEach(result => {

                    var date = new Date(result.commentDate);
                    var month = date.getMonth();
                    var year = date.getFullYear();
                    result.commentDate = months[month] + " " + year;


                    html += "<div class='comment-card'>" +
                        "<div class='row d-flex'>" +
                        "<div>" +
                        "<img class='profile-pic' src='" + result.userImg + "'>" +
                        "</div>" +
                        "<div class='d-flex flex-column'>" +
                        "<h3 class='mt-2 mb-0'>@" + result.userNickname + "</h3>" +
                        "<div class='d-flex mb-0'>" +
                        "<p class='text-left'><span class='text-muted'>" + result.commentScore + "</span>" +
                        "<span class='fa fa-star' ></span>".repeat(5) +
                        "</p>" +
                        "<p class='text-right mt-1'><span class='text-muted'>" + result.userCommentCount + " Yorum</span>" +
                        "</div>" +
                        "<div class='text-left d-flex'  style='margin-top:-18px;'>" +
                        "<p class='text-muted'>" + result.userCity + ", " + result.userCountry + "</p>" +
                        "</div>" +
                        "</div>" +
                        "<div class='ml-auto'>" +
                        "<p class='text-muted pt-5 pt-sm-3'>" + result.commentDate + "</p>" +
                        "</div>" +
                        "</div>" +
                        "<div class='row text-left'>" +
                        "<h4 class='blue-text mt-3'>" + result.commentTitle + "</h4>" +
                        "<p class='content'>" + result.commentContents + "</p>" +
                        "</div>" +
                        "<div class='row text-left mt-4'>" +
                        "<div class='like mr-3 vote'>" +
                        "<img src='" + "dd" + "'>" + result.commentLikeCount + "</span>" +
                        "</div>" +
                        "<div class='unlike vote'>" +
                        " <img src='" + "ddd" + "'><span class='text-muted pl-2'>" + result.commentDislikeCount + "</span>" +
                        "</div>" +
                        "</div>" +
                        "</div>";

                    start_index++;

                });

                locationcomments_data.innerHTML = locationcomments_data.innerHTML + html;

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

icons.forEach(function (icon) {
    icon.onclick = function () {
        icon.classList.toggle('active');
    }
});



