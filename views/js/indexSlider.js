const slider = {
    isDragging: false,
    isAutoPlay: true,
    startX: 0,
    startScrollLeft: 0,
    timeoutId: 0,
    firstCardWidth: 0, // This will be calculated later
    cardPerView: 0, // This will be calculated later

    initialize: function() {
        this.firstCardWidth = this.carousel.querySelector(".indexImage-container").offsetWidth;
        this.cardPerView = Math.round(this.carousel.offsetWidth / this.firstCardWidth);

        // Insert copies of the last few cards to beginning of carousel for infinite scrolling
        this.carouselChildrens.slice(-this.cardPerView).reverse().forEach(card => {
            this.carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
        });

        // Insert copies of the first few cards to end of carousel for infinite scrolling
        this.carouselChildrens.slice(0, this.cardPerView).forEach(card => {
            this.carousel.insertAdjacentHTML("beforeend", card.outerHTML);
        });

        // Scroll the carousel at appropriate position to hide first few duplicate cards on Firefox
        this.carousel.classList.add("no-transition");
        this.carousel.scrollLeft = this.carousel.offsetWidth;
        this.carousel.classList.remove("no-transition");

        // Add event listeners for the arrow buttons to scroll the carousel left and right
        this.arrowBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                this.carousel.scrollLeft += btn.id == "left" ? -this.firstCardWidth : this.firstCardWidth;
            });
        });

        this.carousel.addEventListener("scroll", this.infiniteScroll.bind(this));
        this.wrapper.addEventListener("mouseenter", () => clearTimeout(this.timeoutId));
        this.wrapper.addEventListener("mouseleave", this.autoPlay.bind(this));
        this.autoPlay();
    },

    infiniteScroll: function() {
        if (this.carousel.scrollLeft === 0) {
            this.carousel.classList.add("no-transition");
            this.carousel.scrollLeft = this.carousel.scrollWidth - (4 * this.carousel.offsetWidth);
            this.carousel.classList.remove("no-transition");
        } else if (Math.ceil(this.carousel.scrollLeft) === this.carousel.scrollWidth - this.carousel.offsetWidth) {
            this.carousel.classList.add("no-transition");
            this.carousel.scrollLeft = this.carousel.offsetWidth;
            this.carousel.classList.remove("no-transition");
        }
        clearTimeout(this.timeoutId);
        if (!this.wrapper.matches(":hover")) this.autoPlay();
    },

    autoPlay: function() {
        if (window.innerWidth < 800 || !this.isAutoPlay) return;
        this.timeoutId = setTimeout(() => this.carousel.scrollLeft += this.firstCardWidth, 2500);
    }
};

const slider1 = {
    wrapper: document.querySelector(".wrapperIndex"),
    carousel: document.querySelector(".carouselIndex"),
    arrowBtns: document.querySelectorAll(".wrapperIndex i"),
    carouselChildrens: [...document.querySelector(".carouselIndex").children]
}
const slider2 = {
    wrapper: document.querySelector(".wrapperIndex2"),
    carousel: document.querySelector(".carouselIndex2"),
    arrowBtns: document.querySelectorAll(".wrapperIndex2 i"),
    carouselChildrens: [...document.querySelector(".carouselIndex2").children]
}
const slider3 = {
    wrapper: document.querySelector(".wrapperIndex3"),
    carousel: document.querySelector(".carouselIndex3"),
    arrowBtns: document.querySelectorAll(".wrapperIndex3 i"),
    carouselChildrens: [...document.querySelector(".carouselIndex3").children]
}

Object.assign(slider1, slider);
Object.assign(slider2, slider);
Object.assign(slider3, slider);

//Sliderları başlat
slider1.initialize();
slider2.initialize();
slider3.initialize();

