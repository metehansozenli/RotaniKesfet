var routeID = window.routeID;

document.querySelector('.btn-save').addEventListener('click', () => {
    window.location.href = '/myroutes';
});

// Rotayı Sil Butonu
document.querySelector('.btn-back').addEventListener('click', async () => {
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
        window.location.href = '/myroutes';
    } catch (error) {
        console.error('Hata:', error.message);
    }
});
