document.getElementById('submitButton').addEventListener('click', function () {
    const form = document.getElementById('updateForm');
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch('/update-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Yükleme ekranı göster
            document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh;"><h1>Bilgileriniz güncelleniyor...</h1></div>';
            
            // Ana sayfaya yönlendirme (2 saniye sonra)
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            alert('Güncelleme sırasında bir hata oluştu.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Güncelleme sırasında bir hata oluştu.');
    });
});

document.getElementById('cancelButton').addEventListener('click', function () {
    window.location.href = '/'; 
});