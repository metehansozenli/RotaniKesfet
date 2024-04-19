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
        userName: req.body.ad,
        userSurname: req.body.soyad,
        userCountry: req.body.ulke,
        userMail: req.body.email,
        userPhoneNo: req.body.telefonNumarasi,
        userPass: req.body.sifre,
    };

    try {
        // Veritabanına kayıt ekle
        await client.query('INSERT INTO users ("userMail", "userName", "userSurname", "userCountry", "userPhoneNo", "userPass") VALUES ($1, $2, $3, $4, $5, $6)', [formData.userMail, formData.userName, formData.userSurname, formData.userCountry, formData.userPhoneNo, formData.userPass]);

        // Kayıt işlemi başarılı olduğunda
        res.render("index")
    } catch (error) {
        console.log(error)
        
    }
});

app.post("/login", async (req, res) => {
    const formData = {
        userMail: req.body.email,
        userPass: req.body.password,
    };

    try {
        // Veritabanında kullanıcıyı sorgula
        const result = await client.query('SELECT * FROM users WHERE "userMail" = $1 AND "userPass" = $2', [formData.userMail, formData.userPass]);
        // Eğer kullanıcı bulunursa
        if (result.rows.length > 0) {
            res.render("kesfet")
        } else {
            res.send("Kullanıcı adı veya şifre yanlış!"); // Kullanıcı bulunamazsa hata mesajı gönder
        }
    } catch (error) {
        console.error("Giriş işlemi sırasında bir hata oluştu:", error);
        res.status(500).send("Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
    }
});


app.get("/kesfet", (req,res) => {
    res.render("kesfet")
})

app.get("/index", (req,res) => {
    res.render("index")
})

app.get("/popdest", (req,res) => {
    res.render("popdest")
})


app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});