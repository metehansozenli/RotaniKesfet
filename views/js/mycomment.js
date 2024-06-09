

const selectBtn = document.getElementById("select-btn");

const btnText = document.querySelector(".btn-text");

selectBtn.addEventListener("click", () => {
    selectBtn.classList.toggle("open");
});

const items = document.querySelectorAll(".comments-Listboxs .categoryItems .item");

items.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("checked");

        const checkedItems = document.querySelectorAll(".comments-Listboxs .checked");
        selectedStars = [];

        checkedItems.forEach(checkedItem => {
            const stars = checkedItem.querySelectorAll('.fas.fa-star.text-warning').length; // Yıldızların sayısını al
            selectedStars.push(stars);
        });

        filterCommentsByStars();
    });
});


const selectBtn2 = document.getElementById("select-btn2");
    selectBtn2.addEventListener("click", () => {
        selectBtn2.classList.toggle("open");
    });

    const items2 = document.querySelectorAll(".comments-Listboxs2 .categoryItems .item");
    items2.forEach(item => {
        item.addEventListener("click", () => {
            items2.forEach(i => i.classList.remove("checked")); // Only allow one selection at a time
            item.classList.add("checked");

            let checked2 = document.querySelectorAll(".comments-Listboxs2 .checked"),
                btnText2 = document.querySelector(".btn-text2");

            
            if (checked2 && checked2.length > 0) {
                selectedSorting = checked2[0].querySelector('.item-text').textContent.trim();
                btnText2.innerText = selectedSorting;
            } else {
                btnText2.innerText = "Sıralama Seç";
            }

            sortComments();
        });
    });

    

    const selectBtn3 = document.getElementById("select-btn3");

    selectBtn3.addEventListener("click", () => {
        selectBtn3.classList.toggle("open");
    });

    const items3 = document.querySelectorAll(".comments-Listboxs3 .categoryItems .item");

    items3.forEach(item => {
        item.addEventListener("click", () => {
            item.classList.toggle("checked");

            let checked3 = document.querySelectorAll(".comments-Listboxs3 .checked"),
                btnText3 = document.querySelector(".btn-text3");

            selectedCategories = [];
            checked3.forEach(checkedItem => {
                const categoryText = checkedItem.querySelector('.item-text').textContent.trim();
                selectedCategories.push(categoryText);
            });

           
            
            filterCommentsByCategory();
        });
    });

    

// search clear
function clearText() {
    var input = document.querySelector(".search-input");
    input.value = "";
}


