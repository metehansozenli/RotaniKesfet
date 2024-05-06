wrapper = document.querySelector(".wrapper");
carousel = document.querySelector(".carousel");
firstCardWidth = carousel.querySelector(".card").offsetWidth;
arrowBtns = document.querySelectorAll(".wrapper i");
carouselChildrens = [...carousel.children];

isDragging = false, isAutoPlay = true, startX = 0, startScrollLeft = 0, timeoutId = 0;

// Get the number of cards that can fit in the carousel at once
cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;

    });
});

dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

dragging = (e) => {
    if (!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if (carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (3 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");

    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
}

autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

var commentLinkID = document.getElementById("comment-link");
// Get the modal
var modal = document.getElementById("commentModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on a comment card, open the modal
var commentCards = document.querySelectorAll(".carousel .card");


var isLinkClicked = false;

function resetLinkClicked() {
    isLinkClicked = false;
}

window.addEventListener("pageshow", resetLinkClicked);

commentCards.forEach(function (card) {
    var isDragging = false;
    var commentLinkID = card.querySelector(".comment-location-info");

    window.addEventListener("mousedown", function () {
        isDragging = false;
    });

    card.addEventListener("mousemove", function () {
        isDragging = true;
    });

    if (commentLinkID) {
        commentLinkID.addEventListener("click", function (event) {
            isLinkClicked = true;
        });

        commentLinkID.addEventListener("mouseup", function (event) {
            if (!isDragging || !isLinkClicked) {
                isLinkClicked = true;
            }
        });
    }

    card.addEventListener("mouseup", function (event) {
        if (!isDragging && !isLinkClicked) {
            openCommentModal(this);
        }
    });
});


function openCommentModal(card) {
    var commentPoint = card.querySelector(".comment-point").innerHTML;
    var commentTitle = card.querySelector(".comment-title").innerHTML;
    var testimonial = card.querySelector(".testimonial").innerHTML;
    var profile = card.querySelector(".profile").innerHTML;
    var locationName = card.querySelector(".comment-location-info").innerHTML;

    document.getElementById("modal-stars").innerHTML = commentPoint;
    document.getElementById("modal-comment-title").innerHTML = commentTitle;
    document.getElementById("modal-testimonial").innerHTML = testimonial;
    document.getElementById("modal-profile").innerHTML = profile;
    document.getElementById("modal-locationName").innerHTML = locationName;

    modal.style.display = "block";
}




// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}