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


