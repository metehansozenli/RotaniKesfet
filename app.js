const express = require('express');
const path = require("path")
const hbs = require('hbs');
const client = require("./database.js");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');
const session = require("express-session")
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
const locationcommentData = require("./routes/get_locationcommentDataRoutes")
const account = require("./routes/accountRoutes")



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



app.use(session({
  secret : "gizli_kelime",
  resave : false,
  saveUninitialized : false
}))



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
app.use("/", account)
app.use("/", locationcommentData)



app.get("/mycomment", (req, res) => {
  res.render("mycomment")
})
app.get("/page404", (req, res) => {
  res.render("page404")
})

app.get("/profile", (req, res) => {
  res.render("profile")
})

app.get("/commentWrite", (req, res) => {
  res.render("commentWrite")
})

app.get("/kullanimklavuzu", (req, res) => {
  res.render("kullanimklavuzu")
})

app.get("/calendar", (req, res) => {
  res.render("calendar")
})



app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});


process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

function gracefulShutdown() {
  console.log('Sunucu kapatılıyor...');

 
  // Veritabanı bağlantısını kapat
  client.end(() => {
    console.log('Veritabanı bağlantısı kapatıldı');

  });

}




