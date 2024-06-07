document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');
    const modal = document.getElementById("myModal");
    const modalText = document.getElementById("modalText");
    const span = document.getElementsByClassName("close")[0];

    cards.forEach(card => {
        card.addEventListener('click', function () {
            const infoText = this.getAttribute('data-info');
            modalText.innerHTML = infoText;
            modal.style.display = "block";
        });
    });

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

function toggleClearButton() {
    var input = document.getElementById('search-input');
    var clearBtn = document.querySelector('.clear-btn');
    clearBtn.style.display = input.value.length ? 'block' : 'none';
}

function clearSearch() {
    var input = document.getElementById('search-input');
    input.value = '';
    input.focus();
    toggleClearButton();
}

document.addEventListener('DOMContentLoaded', toggleClearButton);