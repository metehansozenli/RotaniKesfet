const express = require('express');
const path = require("path")
const hbs = require('hbs');
const client = require("./database.js");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');
dotenv.config();
const app = express();
const sessions = {};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// ******************* KURALLAR ***********************************
// LÜTFEN BÜTÜN FONKSIYONLARIN NE OLDUĞUNU NE İŞE YARADIĞINI YORUM SATIRLARIYLA BELİRTİN 
// BİR ŞEY ÇALIŞMIYORSA BURAYA YÜKLEMEYİN ÇALIŞANA KADAR BEKLEYİN DENEMELERİ KENDİNİZE SAKLAYIN KAFA KARIŞTIRMAYIN
const veritabani = require("./controllers/indexController")
const icont = require("./routes/indexRoutes")
const popdest = require("./routes/popDest")
const restaurant = require("./routes/restaurantRoutes");
const hotels  = require('./routes/hotelsRoutes');
const locations = require("./routes/locationRoutes")
const popDestData = require("./routes/get_popDestDataRoutes")
const otherlocationData = require("./routes/get_otherlocationDataRoutes")


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

app.use('/',icont );

app.post("/register", async (req, res) => {

  const formData = {
    userNickname: req.body.nickname,
    userName: req.body.ad,
    userSurname: req.body.soyad,
    userCountry: req.body.ulke,
    userMail: req.body.email,
    userPhoneNo: req.body.telefonNumarasi,
    userPass: req.body.sifre,
  };

  try {
    // Veritabanına kayıt ekle
    await client.query('INSERT INTO users ("userNickname", "userMail", "userName", "userSurname", "userCountry", "userPhoneNo", "userPass") VALUES ($1, $2, $3, $4, $5, $6, $7)', [formData.userNickname, formData.userMail, formData.userName, formData.userSurname, formData.userCountry, formData.userPhoneNo, formData.userPass]);
    const randomCitiesData = await veritabani.getRandomCitiesData();
    // Kayıt işlemi başarılı olduğunda
    res.render("index",{randomCitiesData:randomCitiesData})
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
  res.set('Set-Cookie', `session=; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  try {
    // Veritabanında kullanıcıyı sorgula
    const result = await client.query('SELECT * FROM users WHERE "userMail" = $1 AND "userPass" = $2', [formData.userMail, formData.userPass]);
    // Eğer kullanıcı bulunursa
    if (result.rows.length > 0) {
      const result2 = await client.query('SELECT "userID" FROM users WHERE "userMail" = $1', [formData.userMail]);
      const userID = result2.rows[0].userID;// userID cekiliyor
      sessions[sessionsID] = { userMail: formData.userMail, userID };
      const randomCitiesData = await veritabani.getRandomCitiesData();
      res.set('Set-Cookie', `session=${sessionsID}`);//session baslatiliyor
      res.render("index",{randomCitiesData:randomCitiesData})
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
  const randomCitiesData = await veritabani.getRandomCitiesData();
  res.set('Set-Cookie', `session=; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  res.render("index",{randomCitiesData:randomCitiesData});
});

app.get("/changeHeader", async (req, res) => {
  const sessionsID = req.headers.cookie?.split("=")[1];
  const userSession = sessions[sessionsID];

  if (!userSession) { //session yoksa
    res.render("partials/header");
  }
  else {
    try {
      const userData = await veritabani.getUserData(userSession.userID);
      if (userData) {
        const [userName, userNickname, userSurname] = userData;
        res.render("partials/loginheader", {
          userNickname: userNickname,
          userName: userName,
          userSurname: userSurname
        });
      } else {
        res.send("Bir hata Oluştu!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.send("Bir hata Oluştu!");
    }
  }
});



// Kullanıcı bilgilerini çeken endpoint
app.get('/user', async (req, res) => {
  if (!sessions[sessionsID])
    return;
  const sessionuserId = sessions[sessionsID].userID; // Örnek olarak oturumdan kullanıcı ID'si alınıyor


});

app.get("/kesfet", (req, res) => {
  res.render("kesfet")
})

app.get("/routePlanner", (req, res) => {
  res.render("routePlanner")
})

app.use("/", popdest)
app.use("/", restaurant)
app.use("/",hotels)
app.use("/", locations)
app.use("/", popDestData)
app.use("/", otherlocationData)


app.get("/mycomment", (req, res) => {
  res.render("mycomment")
})
app.get("/page404", (req, res) => {
  res.render("page404")
})

app.get("/profile", (req, res) => {
  res.render("profile")
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


app.get("/calendar", (req, res) => {
  res.render("calendar")
})
