document.addEventListener("DOMContentLoaded", function() {
    let itemsToShow = 3; // İlk başta gösterilecek kart sayısı
    let itemsLoaded = 0;

    const loadMoreBtn = document.getElementById('load-more-btn');
    const cards = document.querySelectorAll('.location-card-container'); // Tüm kartları seç

    // Başlangıçta hiçbir kartı gösterme
    cards.forEach(card => {
        card.style.display = 'none';
    });

    function showMoreItems() {
        const totalCards = cards.length;
        const end = itemsLoaded + itemsToShow;

        for (let i = itemsLoaded; i < end && i < totalCards; i++) {
            cards[i].style.display = 'block';
        }

        itemsLoaded += itemsToShow;

        // Eğer tüm kartlar yüklendi ise, butonu devre dışı bırak ve stilini değiştir
        if (itemsLoaded >= totalCards) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.classList.add('btn-disabled'); // Pasif buton için özel bir stil sınıfı ekleyin
            loadMoreBtn.removeEventListener('click', showMoreItems); // Tıklama olayını kaldır
        }
    }

    // İlk kartları yükle
    showMoreItems();

    loadMoreBtn.addEventListener('click', function() {
        showMoreItems();
        loadMoreBtn.blur(); // Butonun focus durumunu kaldır
    });

    // Delete icons click event
    const deleteIcons = document.querySelectorAll('.remove-icon');

    deleteIcons.forEach(function(icon) {
        icon.onclick = async function () {
            const routeID = parseInt(icon.dataset.routeid);
            // Favori başarıyla güncellendiğinde ilgili öğeyi gizleyin
            const locationCardContainer = icon.closest('.location-card-container');
            if (locationCardContainer) {
                locationCardContainer.style.display = 'none';
            }
            deleteRoute(routeID);
        };
    });

    async function deleteRoute(routeID) {
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
    }
});
