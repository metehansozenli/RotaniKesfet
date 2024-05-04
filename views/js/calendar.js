// Modal açma ve kapatma işlevleri
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
 
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Menü açılıp kapatma işlevi
const btnSelect = document.querySelector(".btn-select");
const items = document.querySelectorAll(".item");
btnSelect.addEventListener("click", () => {
  btnSelect.classList.toggle("open");
});

// Seçilen öğeleri sayma ve buton metnini güncelleme
items.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("checked");

    let btnText = document.querySelector(".btn-text");
    let checked = document.querySelectorAll(".checked");

    if (checked && checked.length > 0) {
      btnText.innerText = `${checked.length} Seçili`;
    } else {
      btnText.innerText = "Kategoriler";
    }
  });
});

$(document).ready(function(){

$('.input-daterange').datepicker({
    format: 'dd-mm-yyyy',
    todayHighlight: true,
    startDate: '0d'
    
});

});


      const ul = document.querySelector("ul"),
      input = document.querySelector("#destinasyon-tag"),
      tagNumb = document.querySelector(".details span");

      let maxTags = 5,
      tags = [];

      countTags();
      createTag();

      function countTags(){
          input.focus();
          tagNumb.innerText = maxTags - tags.length;
      }

      function createTag(){
          ul.querySelectorAll("li").forEach(li => li.remove());
          tags.slice().reverse().forEach(tag =>{
              let liTag = `<li>${tag} <i class="uit uit-multiply" onclick="remove(this, '${tag}')"></i></li>`;
              ul.insertAdjacentHTML("afterbegin", liTag);
          });
          countTags();
      }

      function remove(element, tag){
          let index  = tags.indexOf(tag);
          tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
          element.parentElement.remove();
          countTags();
      }

      function addTag(e){
          if(e.key == "Enter"){
              let tag = e.target.value.replace(/\s+/g, ' ');
              if(tag.length > 1 && !tags.includes(tag)){
                  if(tags.length < 5){
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

      const removeBtn = document.querySelector(".details button");
      removeBtn.addEventListener("click", () =>{
          tags.length = 0;
          ul.querySelectorAll("li").forEach(li => li.remove());
          countTags();
      });
