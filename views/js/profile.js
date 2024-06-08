document.getElementById('submitButton').addEventListener('click', function () {
    const form = document.getElementById('updateForm');
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Form alanlarının kontrolü
    const formFields = ['firstName', 'lastName', 'phoneNumber', 'email', 'password'];
    for (let field of formFields) {
        if (!data[field]) {
            alert('Lütfen tüm alanları doldurun.');
            return; // İşlemi iptal et
        }
    }

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

// Form alanlarının herhangi bir değişikliği kontrol et
document.querySelectorAll('#updateForm input').forEach(input => {
    input.addEventListener('input', function () {
        const form = document.getElementById('updateForm');
        const formData = new FormData(form);

        // Tüm alanlar doldurulmuşsa butonu aktif et
        const allFieldsFilled = Array.from(formData.values()).every(value => value.trim() !== '');
        document.getElementById('submitButton').disabled = !allFieldsFilled;
    });
}); 
