// VERİTABANI İŞLEMLERİ BURADADIR
const express = require('express');

const hbs = require('hbs');
const client = require("../database");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');

const sessionsID = uuidv4();
dotenv.config();
const app = express();
const sessions = {};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
      const result = await client.query('SELECT * FROM locations WHERE "locationID" = $1', [locationID]);
  
  
      if (result.rows.length > 0) {
  
        const locationData = {
          locationCountry: result.rows[0].locationCountry,
          locationCityID: result.rows[0].locationCityID,
          locationCoordinates: result.rows[0].locationCoordinates,
          locationInfo: result.rows[0].locationInfo,
          locationTime: result.rows[0].locationTime,
          locationType: result.rows[0].locationType,
          locationAddress: result.rows[0].locationAddress,
          locationName: result.rows[0].locationName,
          locationScore: result.rows[0].locationScore,
          locationCommentCount: result.rows[0].locationCommentCount,
          locationImg: result.rows[0].locationImg
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
  
  const getPopularCityData = async () => {
    try {
      const query = {
        text: `SELECT cities.*, ARRAY_AGG(locations."locationName") AS "locationNames", ARRAY_AGG(locations."locationID") AS "locationIDs"
               FROM cities 
               LEFT JOIN (
                   SELECT *
                   FROM locations
                   WHERE "locationScore" IN (
                       SELECT DISTINCT "locationScore"
                       FROM locations
                       ORDER BY "locationScore" DESC
                       LIMIT 5
                   )
               ) AS locations ON cities."cityID" = locations."locationCityID" 
               GROUP BY cities."cityID" 
               ORDER BY cities."cityScore" DESC 
               OFFSET $1 
               LIMIT $2`,
        values: [0, 3],
      };
      const result = await client.query(query);
      const cityData = {};
      for (let i = 0; i < result.rows.length; i++) {
        cityData[i] = {
          cityName: result.rows[i].cityName,
          locationNames: result.rows[i].locationNames,
          locationIDs: result.rows[i].locationIDs,
          cityScore: result.rows[i].cityScore,
          cityImg: result.rows[i].cityImg
        }
  
      }
      return cityData;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  
  const getRandomCitiesData = async () => {
    try {
      const result = await client.query(`
                                        SELECT "cityImg", "cityName","cityID"
                                        FROM cities 
                                        WHERE "cityScore" > 3.75 AND "cityID" < 11 
                                        ORDER BY RANDOM() 
                                        LIMIT 8;`);
  
      if (result.rows.length > 0) {
        const randomCitiesData = {};
        for (let i = 0; i < result.rows.length; i++) {
          const result2 = await client.query('SELECT "locationCountry" FROM locations  WHERE "locationCityID" = $1 LIMIT 1', [result.rows[i].cityID]);
          const cityCountry = result2.rows[0].locationCountry;
  
          randomCitiesData[i] = {
            cityCountry: cityCountry,
            cityName: result.rows[i].cityName,
            cityImg: result.rows[i].cityImg
          }
        }
        return randomCitiesData;
  
      }
      else {
        return null; // Return null if no data found
      }
    } catch (error) {
      console.error("Error fetching cities data:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
  }
  
  
  const getRestaurantData = async () => {
    try {
      const result = await client.query('SELECT * FROM locations  WHERE "locationType" = \'Restoran\' ORDER BY "locationScore" DESC, "locationName" DESC');
  
      if (result.rows.length > 0) {
        const restaurantData = {};
  
        for (let i = 0; i < result.rows.length; i++) {
          const result2 = await client.query('SELECT "cityName" FROM cities  WHERE "cityID" = $1', [result.rows[i].locationCityID]);
          locationCityName = result2.rows[0].cityName;
  
          restaurantData[i] = {
            locationCity: locationCityName,
            locationName: result.rows[i].locationName,
            locationImg: result.rows[i].locationImg
          }
        }
        return restaurantData;
      }
      else {
        return null; // Return null if no data found
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
  }
  
  const getHotelData = async () => {
    try {
      const result = await client.query('SELECT * FROM locations  WHERE "locationType" = "Hotel" ORDER BY "locationScore"');
  
      if (result.rows.length > 0) {
        const hotelData = {};
  
        for (let i = 0; i < result.rows.length; i++) {
          const result2 = await client.query('SELECT "cityName" FROM cities  WHERE "cityID" = $1', [result.rows[i].locationCityID]);
          locationCityName = result2.rows[0].cityName;
  
          hotelData[i] = {
            locationCountry: result.rows[i].locationCountry,
            locationCity: locationCityName,
            locationName: result.rows[i].locationName,
            locationScore: result.rows[i].locationScore,
            locationCommentCount: result.rows[i].locationCommentCount,
            locationImg: result.rows[i].locationImg
          }
        }
        return hotelData;
      }
      else {
        return null; // Return null if no data found
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
  }
  
  const getCommentData = async (commentType) => {
    var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    try {
      if(commentType == "restaurant"){
        var queryCustom = 'SELECT comments.*, locations."locationName" FROM comments JOIN locations ON locations."locationID" = comments."locationID" WHERE locations."locationType" = \'Restoran\' ORDER BY RANDOM() LIMIT 12';
      }else if(commentType == "hotel"){
        var queryCustom = 'SELECT comments.*, locations."locationName" FROM comments JOIN locations ON locations."locationID" = comments."locationID" WHERE locations."locationType" = \'Otel\' ORDER BY RANDOM() LIMIT 12';
      }else if(commentType == "popdest"){
        var queryCustom = 'SELECT comments.*, locations."locationName" FROM comments JOIN locations ON locations."locationID" = comments."locationID" WHERE locations."locationType" NOT IN (\'Otel\', \'Restoran\') ORDER BY RANDOM() LIMIT 12';
      }
      else{
        console.error("wrong parameter!!!!");
      }
      const result = await client.query(queryCustom);
  
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
            locationName: result.rows[i].locationName,
            locationLink: "/location?id=" + result.rows[i].locationID,
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
  
  module.exports = {
    getRandomCitiesData,
    getRestaurantData,
    getHotelData,
    getCommentData,
    getSpecifiedLocationData,
    getPopularCityData,
    getUserData
  };