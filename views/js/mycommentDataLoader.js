var start_index = 0;
var number_of_record = 5;
var state = true;
let finish = false;
let j = 0;
var customlikeControlEvent= new CustomEvent('customlikeControlEvent')

document.addEventListener('DOMContentLoaded', function () {

    calculateStarWidths();
    mycomments_load_data(window.userID);

});

window.addEventListener('scroll', async() => {


    if (window.innerHeight + window.scrollY + 6 >= document.body.offsetHeight && state && !finish) {
        

        document.getElementById("loading_animation").style.display = "block";
        setTimeout(1000);
        mycomments_load_data(window.userID);
        
    }
});



const mycomments_load_data = (userID) => {
    return new Promise((resolve, reject) => {
        state = false;
        
        var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

        const request = new XMLHttpRequest();
        request.open('GET', `/get_mycommentData?start_index=${start_index}&num_record=${number_of_record}&userID=${userID}`);

        request.onload = () => {
            results = JSON.parse(request.responseText);


            let html = '';
            if (results.length > 0) {
                results.forEach(result => {


                    var date = new Date(result.commentDate);
                    var month = date.getMonth();
                    var year = date.getFullYear();
                    commentDate = months[month] + " " + year;

                    html += `
                                <div class="comment-card" data-category="${result.locationType}" data-date="${result.commentDate}" data-commentscore="${result.commentScore}">
                                    <div class="row d-flex">
                                        <div class="">
                                            <img class="profile-pic" src="${result.locationImg}">
                                        </div>
                                        <div class="mycomment-info d-flex flex-column">
                                            <h3 class="mt-2 mb-0">${result.locationName}</h3>
                                            <div class="text-left d-flex ">
                                                <p class="text-muted">${result.cityName}, ${result.locationCountry}</p>
                                            </div>
                                            <div class="mycomment-comment-ranking d-flex mb-0">
                                                <p class="point text-left">
                                                    <div class="comment-score text-muted">${result.commentScore}</div>
                                                    <div class="comment-stars">${generateStars()}</div>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="mycomment-date ml-auto">
                                            <p class="text-muted pt-5 pt-sm-3">${commentDate}</p>
                                        </div>
                                    </div>
                                    <div class="d-block row text-left">
                                        <h4 class="blue-text mt-3">"${result.commentTitle}"</h4>
                                        <p class="content">${result.commentContents}</p>
                                    </div>
                                    <div class="vote-section d-flex text-left mt-4" data-commentid="${result.commentID}" data-locationid="${result.locationID}">
                                    <div class="like mr-3 vote">
                                        <button class="likeBtn d-flex">
                                            <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
                                            <span style="margin-left:2px;">${result.commentLikeCount}</span>
                                        </button>
                                    </div>
                                    <div class="unlike vote">
                                        <button class="dislikeBtn d-flex">
                                            <i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
                                            <span style="margin-left:2px;">${result.commentDislikeCount}</span>
                                        </button>
                                    </div>
                                </div>
                                <hr>
                                </div>
                                
                                                    `;
                    commentStar=result.commentScore;
                    start_index++;
                });



                mycomments_data.innerHTML = mycomments_data.innerHTML + html;
                
                document.dispatchEvent(customlikeControlEvent);
                document.dispatchEvent(new CustomEvent('customCommentLoadEvent'));
                document.getElementById("loading_animation").style.display = "none";
                state = true;
                filterCommentsByStars();
                filterCommentsByCategory();
                sortComments();
                filterCommentsByStars();
                window.scrollBy(0, -100);
                resolve(); // İşlem tamamlandığında Promise'i çöz
            } else {
                finish = true;
                document.getElementById("loading_animation").style.display = "none";
                filterCommentsByStars();
                filterCommentsByCategory();
                sortComments();
                filterCommentsByStars();
                window.scrollBy(0, -80);

                resolve(); // İşlem tamamlandığında Promise'i çöz
            }
        };
        request.onerror = () => {
            reject('İstek başarısız');
        };
        request.send();
    });
};





function generateStars() {
    return "<span class='fa fa-star ml-2'></span>".repeat(5);
}

