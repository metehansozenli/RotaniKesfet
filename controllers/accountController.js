const veritabani = require("./indexController")

const client = require("../database.js");

const crypto = require('crypto');

exports.postRegister = async (req, res) => {
    let formData = {
        userNickname: req.body.nickname,
        userName: req.body.ad,
        userSurname: req.body.soyad,
        userCity: req.body.sehir,
        userCountry: req.body.ulke,
        userMail: req.body.email,
        userPhoneNo: req.body.telefonNumarasi,
        userPass: req.body.sifre,
    };
  
    try {

        const hashedPassword = crypto.createHash('sha256').update(formData.userPass).digest('hex');
        formData.userPass = hashedPassword;

        
        // Veritabanına kayıt ekle
        await client.query('INSERT INTO users ("userNickname", "userMail", "userName", "userSurname", "userCity" , "userCountry", "userPhoneNo", "userPass") VALUES ($1, $2, $3, $4, $5, $6, $7, $8 )', [formData.userNickname, formData.userMail, formData.userName, formData.userSurname, formData.userCity, formData.userCountry, formData.userPhoneNo, formData.userPass]);

        const randomCitiesData = await veritabani.getRandomCitiesData();
        const randomCitiesData2 = await veritabani.getRandomCitiesData();
        const restaurantData = await veritabani.getRestaurantData();
        
        res.render("index", { randomCitiesData: randomCitiesData, randomCitiesData2 : randomCitiesData2, restaurantData:restaurantData});
    } catch (error) {
        console.log(error);
    }
  }

exports.postLogin =  async (req, res) => {
    let formData = {
        userMail: req.body.email,
        userPass: req.body.password,
    };
  
    try {
        
        const hashedPassword = crypto.createHash('sha256').update(formData.userPass).digest('hex');
        formData.userPass = hashedPassword;



        
        // Veritabanı
        const result = await client.query('SELECT * FROM users WHERE "userMail" = $1 AND "userPass" = $2', [formData.userMail, formData.userPass]);
  
        
        if (result.rows.length > 0) {
            const result2 = await client.query('SELECT "userID" FROM users WHERE "userMail" = $1', [formData.userMail]);
            const userID = result2.rows[0].userID; // userID çekiliyor
  
            // Oturum verileri buradadır
            req.session.userMail = formData.userMail;
            req.session.userID = userID;
            
            const randomCitiesData = await veritabani.getRandomCitiesData();
            const randomCitiesData2 = await veritabani.getRandomCitiesData();
            const restaurantData = await veritabani.getRestaurantData();
            

            
            
            res.render("index",  { randomCitiesData: randomCitiesData, randomCitiesData2 : randomCitiesData2, restaurantData:restaurantData, userID:req.session.userID});
        } else {
            res.send("Kullanıcı adı veya şifre yanlış!"); // Kullanıcı bulunamazsa hata mesajı gönder
        }
    } catch (error) {
        console.error("Giriş işlemi sırasında bir hata oluştu:", error);
        res.render("page404");
    }
  }

exports.Logout = async (req, res) => {
    // Oturum verilerini sil
    req.session.destroy();
    
    const randomCitiesData = await veritabani.getRandomCitiesData();
    const randomCitiesData2 = await veritabani.getRandomCitiesData();
    const restaurantData = await veritabani.getRestaurantData();
    
    res.set('Set-Cookie', `session=; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    res.render("index",  { randomCitiesData: randomCitiesData, randomCitiesData2 : randomCitiesData2, restaurantData:restaurantData});
  }

exports.changeHeader = async (req, res) => {
    // Oturum bilgilerine eriş
    const userSession = req.session;
  
    if (!userSession.userMail) { // Oturum yoksa
        res.render("partials/header");
    } else {
        try {

            const userData = await veritabani.getUserData(userSession.userID);
            if (userData) {
                const [userName, userNickname, userSurname, userImg] = userData;
                res.render("partials/loginheader", {
                    userNickname: userNickname,
                    userName: userName,
                    userSurname: userSurname,
                    userImg: userImg
                    
                });
            } else {
                res.send("Bir hata Oluştu!");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.render("page404");
        }
    }
  }
