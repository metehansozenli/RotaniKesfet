var startBtn = document.getElementById("travelStartBtn");
var selectBtn = document.getElementById("select-btn");

function travelStartBtn() {
    // Butona tıklandığında yapılacak işlemi belirt  
        $('#travelStartModal').modal('show');
        if (!selectBtn.classList.contains("open")) {
            selectBtn.classList.toggle("open");
        }
    
}


$(document).ready(function(){

    $('.input-daterange input').datepicker({
        format: 'dd-mm-yyyy',
        autoclose: true,
        calendarWeeks : true,
        clearBtn: true,
        disableTouchKeyboard: true,
        orientation: 'top'
    });
    
    });

    items = document.querySelectorAll(".categoryItems .item");
    
    selectBtn.addEventListener("click", () => {
        selectBtn.classList.toggle("open");
    });
    
    items.forEach(item => {
        item.addEventListener("click", () => {
            item.classList.toggle("checked");
    
            let checked = document.querySelectorAll(".checked"),
                btnText = document.querySelector(".btn-text");
    
                if(checked && checked.length > 0){
                    btnText.innerText = `${checked.length} Seçildi`;
                }else{
                    btnText.innerText = "Kategori Seç";
                }
        });
    })


    const ul = document.querySelector(".seyahatAdiSec ul");
    const input = document.querySelector("#destinasyon-tag");
    const tagNumb = document.querySelector(".sehirSecDetaylari span");
    
    let maxTags = 5;
    let tags = [];
    
    countTags();
    createTag();
    
    function countTags() {
        input.focus();
        tagNumb.innerText = maxTags - tags.length;
    }
    
    function createTag() {
        input.value = tags.join(", "); // Tagları input alanının value'sine ekliyoruz
        countTags();
    }
    
    function remove(element, tag) {
        let index = tags.indexOf(tag);
        tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
        element.parentElement.remove();
        createTag(); // Taglar güncellendiğinde input alanını da güncelliyoruz
    }
    
    function addTag(e) {
        if (e.key == "Enter") {
            let tag = e.target.value.replace(/\s+/g, ' ');
            if (tag.length > 1 && !tags.includes(tag)) {
                if (tags.length < 5) {
                    tag.split(',').forEach(tag => {
                        tags.push(tag);
                        createTag();
                    });
                }
            }
            e.target.value = "";
        }
    }
    
    input.addEventListener("keyup", addTag);
    
    // Butonun class'ını doğru şekilde değiştirdim
    const removeBtn = document.querySelector(".sehirSecDetaylari button");
    removeBtn.addEventListener("click", () => {
        tags.length = 0;
        ul.querySelectorAll("li").forEach(li => li.remove());
        createTag();
    });
    

    
    

  



