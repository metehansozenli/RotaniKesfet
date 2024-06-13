document.addEventListener("DOMContentLoaded", function() {
    let itemsToShow = 6; // İlk başta gösterilecek kart sayısı
    let itemsLoaded = 0;

    function showMoreItems() {
        const cards = document.querySelectorAll('.location-card-container');
        const cardsArray = Array.from(cards);
        const visibleCards = cardsArray.filter(card => card.style.display === 'block');

        if (visibleCards.length < cards.length) {
            for (let i = itemsLoaded; i < itemsLoaded + itemsToShow && i < cards.length; i++) {
                cards[i].style.display = 'block';
            }
            itemsLoaded += itemsToShow;

            // Daha fazla gösterilecek kart kalmadığında butonu devre dışı bırak
            if (itemsLoaded >= cards.length) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.style.backgroundColor = '#36A1C5'; // Butonun rengini değiştir
                loadMoreBtn.style.cursor = 'not-allowed'; // Fare işaretçisini değiştir
            }
        }
    }

    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.addEventListener('click', function() {
        showMoreItems();
        loadMoreBtn.blur(); // Butonun focus durumunu kaldır
    });

    // Sayfa yüklendiğinde ilk kartları göster
    showMoreItems();
});

document.addEventListener('DOMContentLoaded', function() {
    const heartIcons = document.querySelectorAll('.heart-icon');

    heartIcons.forEach(function(icon) {
        icon.addEventListener('mouseover', function() {
            icon.classList.add('hovered');
            icon.setAttribute('name', 'close-sharp');
        });

        icon.onclick = async function () {
            if (window.userID) {
                locationID = parseInt(icon.dataset.locationid);
                
                try {
                    // Favori başarıyla güncellendiğinde ilgili öğeyi gizleyin
                    const locationCardContainer = icon.closest('.location-card-container');
                    if (locationCardContainer) {
                        locationCardContainer.style.display = 'none';
                    }

                    const response = await fetch('/api/updatefav', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userID: window.userID, locationID: locationID })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Favori güncellenirken bir hata oluştu:', errorData.message);
                    }
                } catch (error) {
                    console.error('Favori güncellenirken bir hata oluştu:', error);
                }
            }
        };

        icon.parentElement.addEventListener('mouseout', function() {
            icon.classList.remove('hovered');
            icon.setAttribute('name', 'heart');
        });
    });
});
