const veritabani = require("./indexController")
const express = require('express');
const path = require("path")
const hbs = require('hbs');
const client = require("../database");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');
dotenv.config();
const app = express();
const sessions = {};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const sessionsID = uuidv4();

exports.RegisterController = async (req, res) => {

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
  }

  exports.LoginController = async (req, res) => {
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
  }

  exports.LogOutController = async (req, res) => {
    const sessionsID = req.headers.cookie?.split("=")[1];
    delete sessions[sessionsID];
    const randomCitiesData = await veritabani.getRandomCitiesData();
    res.set('Set-Cookie', `session=; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    res.render("index",{randomCitiesData:randomCitiesData});
  }
