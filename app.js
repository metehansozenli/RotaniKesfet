const express = require('express');
const path = require("path")
const hbs = require('hbs');
const client = require("./database.js");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const session = require("express-session")
const crypto = require('crypto');
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// ******************* KURALLAR ***********************************
// LÜTFEN BÜTÜN FONKSIYONLARIN NE OLDUĞUNU NE İŞE YARADIĞINI YORUM SATIRLARIYLA BELİRTİN 
// BİR ŞEY ÇALIŞMIYORSA BURAYA YÜKLEMEYİN ÇALIŞANA KADAR BEKLEYİN DENEMELERİ KENDİNİZE SAKLAYIN KAFA KARIŞTIRMAYIN
const veritabani = require("./controllers/indexController")
const icont = require("./routes/indexRoutes")
const popdest = require("./routes/popDest")
const restaurant = require("./routes/restaurantRoutes");
const hotels = require('./routes/hotelsRoutes');
const locations = require("./routes/locationRoutes")
const popDestData = require("./routes/get_popDestDataRoutes")
const otherlocationData = require("./routes/get_otherlocationDataRoutes")
const locationcommentData = require("./routes/get_locationcommentDataRoutes")
const account = require("./routes/accountRoutes")
const citylocationData = require("./routes/get_citylocationDataRoutes")
const typelocationData = require("./routes/get_typelocationDataRoutes")
const locationCoordinatesData = require("./routes/get_locationCoordinatesRoutes")
const routePlanner = require("./routes/routePlannerRoutes");
const cities = require("./routes/get_citiesRoutes");
const init_routeLocations = require("./routes/init_routeLocationDataRoutes");
const profile = require("./routes/profileRoutes")
const favlocation = require("./routes/favLocationRoutes")
const createtravel = require("./routes/createTravelRoutes")
const locationName = require("./routes/get_locationNameRouter")
const mycomment = require("./routes/mycommentRoutes")
const mycommentData = require("./routes/get_mycommentsDataRoutes")
const commentwrite = require("./routes/commentWriteRoutes")
const commentInsert = require("./routes/commentInsertRoutes")
const myroutes = require("./routes/myroutesRoutes")
const deleteRoute = require("./routes/deleteRouteRoutes")
const AI = require("./routes/routePlannerAIRoutes")

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

app.use('/', icont);



app.use(session({
  secret: "gizli_kelime",
  resave: false,
  saveUninitialized: false
}))



app.get("/kesfet", (req, res) => {
  res.render("kesfet")
})


app.use("/", popdest)
app.use("/", restaurant)
app.use("/", hotels)
app.use("/", locations)
app.use("/", popDestData)
app.use("/", otherlocationData)
app.use("/", account)
app.use("/", locationcommentData)
app.use("/", citylocationData)
app.use("/", typelocationData)
app.use("/", locationCoordinatesData)
app.use("/", routePlanner)
app.use("/", cities)
app.use("/", init_routeLocations)
app.use("/", profile )
app.use("/", favlocation)
app.use("/", createtravel)
app.use("/", locationName)
app.use("/", mycomment)
app.use("/", mycommentData)
app.use("/", commentwrite)
app.use("/", commentInsert)
app.use("/", myroutes)
app.use("/", deleteRoute)
app.use("/", AI)




app.get("/helpPage", (req, res) => {
  res.render("helpPage")
})


app.get("/userGuide", (req, res) => {
  res.render("userGuide")
})

app.get("/calendar", (req, res) => {
  res.render("calendar")
})


app.get("/*", (req, res) => {
  res.render("page404")
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


var i=0;
module.exports = app
// ALLAH RIZASI İÇİN APP.JS'i DAĞITMAYIN
// veri tabanındaki userfavlocationsu güncelliyor
app.post('/api/updatefav', async (req, res) => {
  const { userID, locationID } = req.body;
  try {
    await veritabani.updateUserFavoriteLocations(userID, locationID);
    res.status(200).json({ message: 'Favori başarıyla güncellendi' });
  } catch (error) {
    console.error('Error updating favorites:', error);
    res.status(500).json({ message: 'Favori güncellenirken bir hata oluştu' });
  }
});

app.post('/api/favorites', async (req, res) => {
  const userID  = req.session.userID;
  try {
      const data = await veritabani.getUserFavouriteLocations(userID);
      res.json(data);
  } catch (error) {
      console.error('Error fetching favorite locations:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/voteComments', async (req, res) => {
  const userID = req.session.userID;
  const locationID = req.body.locationID;

  if (!userID || !locationID) {
    return res.status(400).json({ message: 'Invalid userID or locationID' });
  }

  try {
    const data = await veritabani.getUserVotedComments(userID, locationID);
    res.json(data);
  } catch (error) {
    console.error('Error fetching voted comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/update-like', (req, res) => {
  console.log("nnn")
  const { commentID, userID, voteType } = req.body;

  
  
  new Promise(async (resolve, reject) => {
    try {
      const userVoteComment = await client.query(`SELECT "voteType" FROM uservotecomments WHERE "userID" = $1 AND "commentID" = $2;`, [userID, commentID]);
      let userHasVoted;
      
      if (userVoteComment.rows.length > 0) {
        await client.query(`DELETE FROM uservotecomments WHERE "userID" = $1 AND "commentID" = $2;`, [userID, commentID]);
        userHasVoted = userVoteComment.rows[0].voteType;
        let sql;
        if (userHasVoted == "like") {
          sql = `UPDATE comments SET "commentLikeCount" = "commentLikeCount" - 1 WHERE "commentID" = $1`;
        } else {
          sql = `UPDATE comments SET "commentDislikeCount" = "commentDislikeCount" - 1 WHERE "commentID" = $1`;
        }
        
        const values = [commentID];
        await client.query(sql, values);
      }
      
      if (userHasVoted != voteType) {
        await client.query(`INSERT INTO uservotecomments ("userID", "commentID", "voteType") VALUES ($1, $2, $3);`, [userID, commentID, voteType]);
        let sql;
        if (voteType == "like") {
          sql = `UPDATE comments SET "commentLikeCount" = "commentLikeCount" + 1 WHERE "commentID" = $1`;
        } else {
          sql = `UPDATE comments SET "commentDislikeCount" = "commentDislikeCount" + 1 WHERE "commentID" = $1`;
        }
        
        const values = [commentID];
        await client.query(sql, values);
      }
      
      resolve();
    } catch (error) {
      reject(error);
    }
  })
  .then(() => {
    res.send("Success");
  })
  .catch(error => {
    console.error('Veritabanında like veya dislike sayısı güncellenirken hata oluştu: ' + error.message);
    res.render("page404");
  });
});




app.get('/get_votetype', async (req, res) => {
  const { commentID, userID } = req.query;
  
  try {
    // Burada commentID ve userID kullanarak uservotecomments tablosundan voteType değerini alın
    
    // Örneğin, bir veritabanı sorgusu yapabilirsiniz
    const voteType = await client.query(`SELECT "voteType" FROM uservotecomments WHERE "commentID" = $1 AND "userID" = $2`, [commentID, userID]);
    
    // Sorgu sonucundan gelen voteType değerini alın
    const voteTypeValue = voteType.rows[0] ? voteType.rows[0].voteType : null;
    
    // VoteType değerini JSON olarak yanıt olarak gönder
    res.json({ voteType: voteTypeValue });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/getCityIDs', async (req, res) => {
  try {
    const tags = req.body.tags;
    const cityIDs = [];
    
    
    // Etiketlerle eşleşen şehirleri veritabanından çek
    for (const tag of tags) {
      const result = await client.query('SELECT "cityID" FROM cities WHERE "cityName" = $1', [tag]);
      if (result.rows.length > 0) {
        cityIDs.push(result.rows[0].cityID);
      }
    }
    
    
    res.json({ cityIDs: cityIDs });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});




app.post('/updateTravel', async (req, res) => {
  try {

    const {
      routeLocations,
      routeChoices,
      routeID
    } = req.body;

    // routes tablosuna ekleme işlemi
    const query = {
      text: `
        UPDATE 
          routes
        SET 
          "routeLocations" = $1,
          "routeChoices" = $2
        WHERE
          "routeID" = $3
      `,
      values: [routeLocations, routeChoices, routeID],
    };
    await client.query(query);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating travel:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

app.post('/update-profile', (req, res) => {
  let { firstName, lastName, phoneNumber, email, password, nickName } = req.body;
  const userID = req.session.userID; // Oturumdan kullanıcı kimliğini alın

  // Şifreyi hashle
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  password = hashedPassword;

  // Kullanıcı verilerini güncelle
  const sql = 'UPDATE users SET "userName" = $1, "userSurname" = $2, "userPhoneNo" = $3, "userMail" = $4, "userPass" = $5, "userNickname" = $6 WHERE "userID" = $7';
  const values = [firstName, lastName, phoneNumber, email, password, nickName, userID];

  client.query(sql, values, (err, result) => {
    if (err) {
      console.error('Profil güncellenirken hata oluştu:', err);
      return res.status(500).json({ success: false, message: 'Profil güncellenirken bir hata oluştu' });
    }
    res.json({ success: true, message: 'Profil başarıyla güncellendi' });
  });
});




app.post('/get_locationTypeCount', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT c."cityName", l."locationType", COUNT(*) AS typeCount
      FROM locations l
      JOIN cities c ON l."locationCityID" = c."cityID"
      GROUP BY c."cityName", l."locationType";
    `);

    // Veritabanından gelen sonuçları uygun bir veri yapısına dönüştür
    const locationTypeCounts = result.rows.map(row => ({
      cityName: row.cityName,
      locationType: row.locationType,
      count: row.typecount
    }));

    // Sonuçları JSON olarak gönder
    res.json({ locationTypeCData: locationTypeCounts });
  } catch (err) {
    console.error('Hata oluştu:', err);
    // Hata durumunda 500 Internal Server Error gönder
    res.status(500).send("Internal Server Error");
  }
});




// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
  
    // Şehirler ve rotaları veritabanından al
    const cities = await veritabani.getCities();
    const routeData = await veritabani.getRoutesData(869);

    // Rota seçeneklerini ve şehir ID'lerini al
    const routeChoices = routeData.routeChoices;
    const cityIDs = cities.map(city => city.cityID);

    // Seçilen AI lokasyon verilerini al
    const locations = await veritabani.getSelectedAILocationData(routeChoices, cityIDs);
    
    // Lokasyon ve şehir verilerini birlikte al
    const combinedData = locations.map((location, index) => {
      const city = cities.find(city => city.cityID === location.cityID);
      return `Locatiın ID: ${location.locationID}, Location Name: ${location.locationName}, City ID: ${city.cityID}, City Name: ${city.cityName}, Location Coordinates: ${location.locationCoordinates}, Location Time: ${location.locationTime}`;
    }).join(' | ');

    const uniqueCities = new Set();
    const cityDataArray = [];
    
    locations.forEach((location) => {
      if (!uniqueCities.has(location.cityName)) {
        const [latStr, lonStr] = location.cityCoordinates.split(',');
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr.replace('° N', '').replace('° E', '').replace('° W', '').replace('° S', '').trim()) * 
          (location.cityCoordinates.includes('W') || location.cityCoordinates.includes('S') ? -1 : 1);
        cityDataArray.push({
          name: location.cityName,
          lat: lat,
          lon: lon
        });
        uniqueCities.add(location.cityName);
      }
    });

    
    function getRandomCity(cities) {
      const randomIndex = Math.floor(Math.random() * cities.length);
      return cities[randomIndex];
    }
    
    // Step 3: Calculate distance between two cities using Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Earth's radius in kilometers
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    }
    
    // Step 4: Get nearby cities based on distance
    function getNearbyCities(selectedCity, cities, count) {
      const nearbyCities = cities
        .filter(city => city.name !== selectedCity.name)
        .map(city => ({
          ...city,
          distance: calculateDistance(selectedCity.lat, selectedCity.lon, city.lat, city.lon)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, count);
      return nearbyCities;
    }
    
    const cityCount = 3;
    const travelDuration = 5;
    const userID = 6;
    
    const selectedCity = getRandomCity(cityDataArray);
    const nearbyCities = getNearbyCities(selectedCity, cityDataArray, cityCount - 1);
    const selectedCities = [selectedCity, ...nearbyCities];
    
    const cityNamesString = selectedCities.map(city => city.name).join(', ');
    
    console.log(cityNamesString);

    // Prompt metnini oluştururken verileri kullan
    const jsonString = `{
      "userID": 2,
      "clusters": [
        {
          "cityID": 3,
          "clusters": [
            [
              {
                "locationID": 56,
                "coordinates": [
                  51.5008,
                  -0.1779
                ]
              },
              {
                "locationID": 52,
                "coordinates": [
                  51.5154,
                  -0.1412
                ]
              },
              {
                "locationID": 45,
                "coordinates": [
                  51.5073,
                  -0.1657
                ]
              }
            ],
            [
              {
                "locationID": 44,
                "coordinates": [
                  51.5055,
                  -0.0754
                ]
              },
              {
                "locationID": 59,
                "coordinates": [
                  51.5045,
                  -0.0865
                ]
              },
              {
                "locationID": 54,
                "coordinates": [
                  51.5081,
                  -0.0976
                ]
              }
            ]
          ]
        },
        {
          "cityID": 8,
          "clusters": [
            [
              {
                "locationID": 159,
                "coordinates": [
                  52.5146,
                  13.3506
                ]
              },
              {
                "locationID": 150,
                "coordinates": [
                  52.5031,
                  13.3357
                ]
              },
              {
                "locationID": 141,
                "coordinates": [
                  52.5054,
                  13.3325
                ]
              },
              {
                "locationID": 151,
                "coordinates": [
                  52.503,
                  13.3354
                ]
              },
              {
                "locationID": 152,
                "coordinates": [
                  52.5146,
                  13.3925
                ]
              },
              {
                "locationID": 153,
                "coordinates": [
                  52.504,
                  13.3927
                ]
              },
              {
                "locationID": 147,
                "coordinates": [
                  52.506,
                  13.3325
                ]
              },
              {
                "locationID": 149,
                "coordinates": [
                  52.5096,
                  13.3686
                ]
              }
            ]
          ]
        }
      ]   
    }`;   

    
    const prompt = `
userID: ${userID}
Veriler:
${combinedData}

Lütfen ${cityNamesString} şehirlerini kullanarak toplam ${travelDuration} günlük bir seyahat kümesi oluşturun. Seyahat günlerini ve şehirleri aşağıdaki formatta gösterin:
Örnek Çıktı Formatı:
${jsonString}

Not: Yanıtınızı her zaman yukarıdaki formatta sunun ve ekstra bir şey eklemeyin.

`;


    // Metin oluşturma işlemini gerçekleştir
    const result = await model.generateContent(prompt);
    const response = await result.response;
    var text = response.text();
    text = text.replace(/```json|```/g, '').trim();

    const jsonObject = JSON.parse(text);
    
    console.log(JSON.stringify(jsonObject, null, 2));



}

//run();



