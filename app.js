const express = require('express');
const path = require("path")
const hbs = require('hbs');
const client = require("./database.js");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');
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

const sessions = {}

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

const sessionsID = uuidv4();

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
            const result2 = await client.query('SELECT "userID" FROM users WHERE "userMail" = $1', [formData.userMail]);
            const userID = result2.rows[0].userID;// userID cekiliyor
            sessions[sessionsID] = { userMail: formData.userMail, userID };
            res.set('Set-Cookie',`session=${sessionsID}`);//session baslatiliyor
            res.render("index")
        } else {
            res.send("Kullanıcı adı veya şifre yanlış!"); // Kullanıcı bulunamazsa hata mesajı gönder
        }
    } catch (error) {
        console.error("Giriş işlemi sırasında bir hata oluştu:", error);
        res.status(500).send("Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
    }
});

app.get("/logout", async (req, res) => {
    const sessionsID = req.headers.cookie?.split("=")[1];
    delete sessions[sessionsID];
    res.set('Set-Cookie',`session=; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
});

app.get("/changeHeader", async (req, res) => {
  const sessionsID = req.headers.cookie?.split("=")[1];
  const userSession = sessions[sessionsID];
  
  if(!userSession){//session yoksa
    res.render("partials/header");  
  }else {
    res.render("partials/loginheader");
  }
 
});

// Kullanıcı bilgilerini çeken endpoint
app.get('/user', async(req, res) => {
    if(!sessions[sessionsID])
        return;
    const sessionuserId = sessions[sessionsID].userID; // Örnek olarak oturumdan kullanıcı ID'si alınıyor
    try {   
        const result2 = await client.query('SELECT "userNickname", "userName", "userSurname" FROM users WHERE "userID" = $1', [sessionuserId]);
        if (result2.rows.length > 0) {
            const userNickname = result2.rows[0].userNickname;// userID cekiliyor
            const userName = result2.rows[0].userName;
            const userSurname = result2.rows[0].userSurname;
            console.log(userName);
            res.render("/view/partials/loginheader",{
                userNickname : userNickname,
                userName : userName,
                userSurname : userSurname
            });
        } else {
            res.send("Bir hata Oluştu!"); 
        }
    } catch (error) {
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


process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

function gracefulShutdown() {
    console.log('Sunucu kapatılıyor...');

    // Oturumları kapat
    for (const sessionID in sessions) {
        delete sessions[sessionID];
    }

    // Veritabanı bağlantısını kapat
    client.end(() => {
        console.log('Veritabanı bağlantısı kapatıldı');
        
    });

}