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
      res.set('Set-Cookie', `session=${sessionsID}`);//session baslatiliyor
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
  res.set('Set-Cookie', `session=; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  res.render("index");
});

app.get("/changeHeader", async (req, res) => {
  const sessionsID = req.headers.cookie?.split("=")[1];
  const userSession = sessions[sessionsID];

  if (!userSession) { //session yoksa
    res.render("partials/header");
  }
  else {
    try {
      const userData = await getUserData(userSession.userID);
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


const getUserData = async (sessionuserId) => {
  try {
    const result2 = await client.query('SELECT "userNickname", "userName", "userSurname" FROM users WHERE "userID" = $1', [sessionuserId]);
    if (result2.rows.length > 0) {
      const userNickname = result2.rows[0].userNickname;
      const userName = result2.rows[0].userName;
      const userSurname = result2.rows[0].userSurname;
      return [userName, userNickname, userSurname];
    } else {
      return null; // Return null if no data found
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
}

const getSpecifiedLocationData = async (locationID) => {
  try {
    const result = await client.query('SELECT * FROM locations where "locationID" = $1', locationID);

    if (result.rows.length > 0) {

      const locationData = {
        locationCountry: result.rows[0].locationCountry,
        locationCity: result.rows[0].locationCity,
        locationCoordinates: result.rows[0].locationCoordinates,
        locationInfo: result.rows[0].locationInfo,
        LocationTime: result.rows[0].LocationTime,
        LocationType: result.rows[0].LocationType,
        LocationAddress: result.rows[0].LocationAddress,
        LocationName: result.rows[0].LocationName,
        LocationScore: result.rows[0].LocationScore,
        LocationCommentCount: result.rows[0].LocationCommentCount
      }

      return locationData;
    }
    else {
      return null; // Return null if no data found
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
}

const getPopularLocationsData = async (locationType, limit) => {
  try {
    const result = await client.query('SELECT * FROM locations  WHERE "locationType" = $1 ORDER BY "locationScore" DESC LIMIT $2', locationType, limit);

    if (result.rows.length > 0) {

      const popularLocationsData = result.rows.map(row => ({
        locationCountry: row.locationCountry,
        locationCity: row.locationCity,
        locationCoordinates: row.locationCoordinates,
        locationInfo: row.locationInfo,
        locationTime: row.locationTime,
        locationType: row.locationType,
        locationAddress: row.locationAddress,
        locationName: row.locationName,
        locationScore: row.locationScore,
        locationCommentCount: row.locationCommentCount
      }));

      return popularLocationsData;
    }
    else {
      return null; // Return null if no data found
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
}


const getCommentData = async (locationId) => {
  var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  try {
    const result = await client.query('SELECT "commentContents", "commentDate", "commentScore", "commentTitle", "userID" FROM comments WHERE "locationID" = $1', [locationId]);

    if (result.rows.length > 0) {
      const commentsData = [];
      for (let i = 0; i < result.rows.length; i++) {
        const userData = await getUserData(result.rows[i].userID); //kullanıcı id sine göre kullanıcı verilerini cekiyor
        const userNickname = userData[1]; //Cekilen verilerden nickname alınıyor

        var date = result.rows[i].commentDate;
        date = new Date();
        var month = date.getMonth();
        var year = date.getFullYear();
        result.rows[i].commentDate = months[month] + " " + year;

        commentsData[i] = {
          userNickname: userNickname,
          commentContents: result.rows[i].commentContents,
          commentDate: result.rows[i].commentDate,
          commentScore: result.rows[i].commentScore,
          commentTitle: result.rows[i].commentTitle,
          userProfilePic: "./images/avatar.jpeg",
          locationName: "Eyfel Kulesi",
          locationLink: "/location",
        }

      }
      return commentsData;
    }
    else {
      return null; // Return null if no data found
    }
  } catch (error) {
    console.error("Error fetching comment data:", error);
    throw error; // Rethrow the error to be caught by the caller
  }

}


// Kullanıcı bilgilerini çeken endpoint
app.get('/user', async (req, res) => {
  if (!sessions[sessionsID])
    return;
  const sessionuserId = sessions[sessionsID].userID; // Örnek olarak oturumdan kullanıcı ID'si alınıyor


});


app.get("/kesfet", (req, res) => {
  res.render("kesfet")
})

app.get("/index", (req, res) => {
  res.render("index")
})

app.get("/popdest", async (req, res) => {
  try {
    const commentsData = await getCommentData(2);
    res.render("popdest", { commentsData: commentsData });
  } catch (error) {
    console.error("Popdesti yaparken hata olustu:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/location", (req, res) => {
  res.render("location")
})

app.get("/mycomment", (req, res) => {
  res.render("mycomment")
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


//Mustafa'nın Gizli Denemeleri
app.get("/get_popDestData", async (req, res) => {
  try {
      const start_index = parseInt(req.query.start_index) || 0;
      const num_record = parseInt(req.query.num_record) || 10;

      const query = {
        text: 'SELECT cities.*, ARRAY_AGG(locations."locationName") AS "locationNames" FROM cities LEFT JOIN locations ON cities."cityID" = locations."locationCityID" GROUP BY cities."cityID" ORDER BY cities."cityScore" DESC OFFSET $1 LIMIT $2',
        values: [start_index, num_record],
    };
    
      const result = await client.query(query);

      res.json(result.rows); // Sonuçları JSON olarak gönderme
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Internal Server Error");
  }
});

