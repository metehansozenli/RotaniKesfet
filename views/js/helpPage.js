document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');
    const modal = document.getElementById("myModal");
    const modalText = document.getElementById("modalText");
    const span = document.getElementsByClassName("close")[0];
    const closeButtons = document.querySelectorAll(".close");

    cards.forEach(card => {
        card.addEventListener('click', function () {
            const infoText = this.getAttribute('data-info');
            modalText.innerHTML = infoText;
            modal.style.display = "block";
            hiddenMainScroll();
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

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            displayMainScroll();
        });
    });
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

function hiddenMainScroll() {
    document.body.style.overflow = 'hidden';
}

// Modal kapatıldığında
function displayMainScroll() {
    document.body.style.overflow = 'auto';
}
