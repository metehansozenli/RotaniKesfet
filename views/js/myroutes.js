const deletIcons = document.querySelectorAll('.remove-icon');


document.addEventListener("DOMContentLoaded", function() {
    let itemsToShow = 5; // İlk başta gösterilecek kart sayısı
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
        }
    }

    document.getElementById('load-more-btn').addEventListener('click', showMoreItems);

    // Sayfa yüklendiğinde ilk kartları göster
    showMoreItems();
});



    deletIcons.forEach(function(icon) {

        icon.onclick = async function () {
            routeID=parseInt(icon.dataset.routeid);
              // Favori başarıyla güncellendiğinde ilgili öğeyi gizleyin
              const locationCardContainer = icon.closest('.location-card-container');
              if (locationCardContainer) {
                 
                  locationCardContainer.style.display = 'none';
              }

              deletRoute (routeID);

        };

    });


    async function deletRoute (routeID) {
        try {
            // Rotayı silmek için bir istek gönder
            const response = await fetch('/deleteRoute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Silinecek rota bilgisini gönder
                body: JSON.stringify({ routeID: routeID })
            });
            if (!response.ok) {
                throw new Error('Rota silinirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Hata:', error.message);
        }
    };