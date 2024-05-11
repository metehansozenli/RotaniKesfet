items = document.querySelectorAll(".comments-Listboxs .categoryItems .item");
  
var selectBtn = document.getElementById("select-btn");
selectBtn.addEventListener("click", () => {
    selectBtn.classList.toggle("open");
});


items.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("checked");

        let checked = document.querySelectorAll(".comments-Listboxs .checked"),
            btnText = document.querySelector(".btn-text");

        if (checked && checked.length > 0) {
            btnText.innerText = `${checked.length} Seçildi`;
        } else {
            btnText.innerText = "Puan Seç";
        }
    });
})


items2 = document.querySelectorAll(".comments-Listboxs2 .categoryItems .item");

var selectBtn2 = document.getElementById("select-btn2");
selectBtn2.addEventListener("click", () => {
    selectBtn2.classList.toggle("open");
});

items2.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("checked");

        let checked2 = document.querySelectorAll(".comments-Listboxs2 .checked"),
            btnText2 = document.querySelector(".btn-text2");

        if (checked2 && checked2.length > 0) {
            btnText2.innerText = `${checked2.length} Seçildi`;
        } else {
            btnText2.innerText = "Sıralama Seç";
        }
    });
})

 
items3 = document.querySelectorAll(".comments-Listboxs3 .categoryItems .item");

var selectBtn3 = document.getElementById("select-btn3");
selectBtn3.addEventListener("click", () => {
    selectBtn3.classList.toggle("open");
});

items3.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("checked");

        let checked3 = document.querySelectorAll(".comments-Listboxs3 .checked"),
            btnText3 = document.querySelector(".btn-text3");

        if (checked3 && checked3.length > 0) {
            btnText3.innerText = `${checked3.length} Seçildi`;
        } else {
            btnText3.innerText = "Kategori Seç";
        }
    });
})


// search clear
function clearText() {
    var input = document.querySelector(".search-input");
    input.value = "";
}



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

Object.assign(slider1, slider);
slider1.initialize();