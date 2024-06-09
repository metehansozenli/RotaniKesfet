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

    // Daha fazla butonu
    document.addEventListener("DOMContentLoaded", function() {
        const itemsPerLoad = 3; // Her seferinde yüklenecek öğe sayısı
        let loadedItems = 0; // Şu ana kadar yüklenen öğe sayısı
    
        const cards = document.querySelectorAll('.location-card-container'); // Tüm kartları seç
        // Başlangıçta hiçbir kartı gösterme
        cards.forEach(card => {
            card.style.display = 'none';
        });
    
        function showMoreItems() {
            const totalCards = cards.length;
            const end = loadedItems + itemsPerLoad;
    
            for (let i = loadedItems; i < end && i < totalCards; i++) {
                cards[i].style.display = 'block';
            }
    
            loadedItems += itemsPerLoad;
    
            // Eğer tüm kartlar yüklendi ise, butonu devre dışı bırak ve stilini değiştir
            if (loadedItems >= totalCards) {
                const btn = document.getElementById('load-more-btn');
                btn.disabled = true;
                btn.classList.add('btn-disabled'); // Pasif buton için özel bir stil sınıfı ekleyin
                btn.removeEventListener('click', showMoreItems); // Tıklama olayını kaldır
            }
        }
    
        // İlk kartları yükle (ilk üç kart)
        showMoreItems();
    
        const loadMoreBtn = document.getElementById('load-more-btn');
        loadMoreBtn.addEventListener('click', showMoreItems);
    });
    