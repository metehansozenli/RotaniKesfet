const express = require('express');
const path = require("path")
const hbs = require('hbs');
const client = require("./database.js");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

client.connect((err) => {
    if (err) {
        console.error('Veritabanına bağlanırken bir hata oluştu:', err.stack);
        return;
    }
    console.log('Veritabanına başarıyla bağlandı.');
});


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(express.static("views"));

app.get('/', (req, res) => {
    res.render('index'); 
});

app.post("/register", async (req, res) => {
  
    const formData = {
        email: req.body.email,
        ad: req.body.ad,
        soyad: req.body.soyad,
        adres: req.body.adres,
        ilce: req.body.ilce,
        postaKodu: req.body.postaKodu,
        ulke: req.body.ulke,
        alanKodu: req.body.alanKodu,
        telefonNumarasi: req.body.telefonNumarasi,
        sifre: req.body.sifre,
        
    };

    try {
        // Veritabanına kayıt ekle
        await client.query('INSERT INTO users (email, ad, soyad, adres, ilce, postaKodu, ulke, alanKodu, telefonNumarasi, sifre) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [formData.email, formData.ad, formData.soyad, formData.adres, formData.ilce, formData.postaKodu, formData.ulke, formData.alanKodu, formData.telefonNumarasi, formData.sifre]);
        
        // Kayıt işlemi başarılı olduğunda
        res.render('index', { success: 'Kayıt işlemi başarıyla tamamlandı.' });
    } catch (error) {
        // Kayıt işlemi sırasında bir hata oluştuğunda
        res.render('', { error: 'Kayıt işlemi başarısız oldu.' });
    }
});


app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});