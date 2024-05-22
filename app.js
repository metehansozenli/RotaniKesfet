const express = require('express');
const path = require("path")
const hbs = require('hbs');
const client = require("./database.js");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const session = require("express-session")
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

app.get("/mycomment", (req, res) => {
  res.render("mycomment")
})


// app.get("/profile", (req, res) => {
//   res.render("profile")
// })

app.get("/commentWrite", (req, res) => {
  res.render("commentWrite")
})

app.get("/kullanimklavuzu", (req, res) => {
  res.render("kullanimklavuzu")
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



module.exports = app




app.post('/update-like', (req, res) => {
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


app.post('/createTravel', async (req, res) => {
  try {
    const {
      routeCreationDate,
      routeTitle,
      routeStartDates,
      routeFinishDates,
      userID,
      routeChoices,
      cityIDs
    } = req.body;
    
     
    // routes tablosuna ekleme işlemi
    const routeInsertQuery =  `
                              INSERT INTO 
                                routes ("routeCreationDate", "routeTitle", "userID", "routeCities", "routeStartDates", "routeFinishDates","routeChoices")
                              VALUES 
                                ($1, $2, $3, $4, $5, $6, $7)
                              RETURNING "routeID";
                              `;

    const routeValues = [routeCreationDate, routeTitle, userID, cityIDs, routeStartDates, routeFinishDates, routeChoices];
    const result = await client.query(routeInsertQuery, routeValues);
    const newRouteID = result.rows[0].routeID;
    

    res.status(200).json({ success: true, newRouteID:newRouteID });
    
    
  } catch (error) {
    console.error('Error creating travel:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
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



