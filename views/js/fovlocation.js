
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
        }
    }

    document.getElementById('load-more-btn').addEventListener('click', showMoreItems);

    // Sayfa yüklendiğinde ilk kartları göster
    showMoreItems();
});