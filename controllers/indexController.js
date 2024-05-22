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
var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
var locationTypes;
const getUserData = async (sessionuserId) => {
    try {
      const result2 = await client.query('SELECT "userNickname", "userName", "userSurname", "userImg" FROM users WHERE "userID" = $1', [sessionuserId]);
      if (result2.rows.length > 0) {
        const userNickname = result2.rows[0].userNickname;
        const userName = result2.rows[0].userName;
        const userSurname = result2.rows[0].userSurname;
        const userImg = result2.rows[0].userImg;
        return [userName, userNickname, userSurname, userImg];
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
          const coordinates = result.rows[0].locationCoordinates;
          const parts = coordinates.split(",");
          const latitude = parts[0].trim();
          const longitude = parts[1].trim();

          const locationData = {
          locationID: result.rows[0].locationID,
          locationCountry: result.rows[0].locationCountry,
          locationCityID: result.rows[0].locationCityID,
          locationCoordinatesLat: latitude,
          locationCoordinatesLong: longitude,
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
      const query = `
                    SELECT 
                      cities."cityImg", 
                      cities."cityName",
                      cities."cityID",
                      MAX(locations."locationCountry") AS "locationCountry"
                    FROM 
                      cities 
                    JOIN 
                      locations ON cities."cityID" = locations."locationCityID"
                    WHERE 
                      cities."cityScore" > 3.75
                    GROUP BY 
                      cities."cityID", cities."cityImg", cities."cityName"
                    ORDER BY 
                      RANDOM()
                    LIMIT 8;
                  `;

    const result = await client.query(query);

    if (result.rows.length > 0) {
      const randomCitiesData = result.rows.map(row => ({
        cityCountry: row.locationCountry,
        cityName: row.cityName,
        cityImg: row.cityImg
      }));

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
      const query = `
                    SELECT 
                      locations.*, 
                      cities."cityName" AS "locationCity"
                    FROM 
                      locations 
                    JOIN 
                      cities ON locations."locationCityID" = cities."cityID"
                    WHERE 
                      locations."locationType" = 'Restoran'
                    ORDER BY 
                      locations."locationScore" DESC, 
                      locations."locationName" DESC
                    `;

      const result = await client.query(query);

      if (result.rows.length > 0) {
      const restaurantData = result.rows.map(row => ({
        locationCity: row.locationCity,
        locationName: row.locationName,
        locationImg: row.locationImg
      }));

      return restaurantData;
      }
      else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      throw error; 
    }
  }
  
  const getHotelData = async () => {
    try {
      const query = `
                    SELECT 
                      locations.*, 
                      cities."cityName" AS "locationCity"
                    FROM 
                      locations 
                    JOIN 
                      cities ON locations."locationCityID" = cities."cityID"
                    WHERE 
                      locations."locationType" = 'Otel'
                    ORDER BY 
                      locations."locationScore" DESC, 
                      locations."locationName" DESC
                    `;

      const result = await client.query(query);

      if (result.rows.length > 0) {
        const hotelData = result.rows.map(row => ({

          locationCountry: row.locationCountry,
          locationCity: row.locationCity,
          locationName: row.locationName,
          locationScore: row.locationScore,
          locationCommentCount: row.locationCommentCount,
          locationImg: row.locationImg
      }));

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
    try {
      if(commentType == "restaurant"){
        var queryCustom = `
                          SELECT comments.*, locations."locationName", users."userNickname"
                          FROM comments 
                          JOIN locations 
                          ON locations."locationID" = comments."locationID" 
                          JOIN users  
                          ON users."userID" = comments."userID"
                          WHERE locations."locationType" = 'Restoran'
                          ORDER BY RANDOM() 
                          LIMIT 12;
                          `;
      }else if(commentType == "hotel"){
        var queryCustom = `
                          SELECT comments.*, locations."locationName", users."userNickname"
                          FROM comments 
                          JOIN locations 
                          ON locations."locationID" = comments."locationID" 
                          JOIN users  
                          ON users."userID" = comments."userID"
                          WHERE locations."locationType" = 'Otel'
                          ORDER BY RANDOM() 
                          LIMIT 12;
                          `;
      
      }else if(commentType == "popdest"){
        var queryCustom = `
                          SELECT comments.*, locations."locationName", users."userNickname"
                          FROM comments 
                          JOIN locations 
                          ON locations."locationID" = comments."locationID" 
                          JOIN users  
                          ON users."userID" = comments."userID"
                          WHERE locations."locationType" NOT IN ('Otel', 'Restoran')
                          ORDER BY RANDOM() 
                          LIMIT 12
                          `;
      }
      else{
        console.error("wrong parameter!!!!");
      }
      const result = await client.query(queryCustom);
      
      if (result.rows.length > 0) {
        
        const commentsData = result.rows.map(row => {

          // Tarih verisi ay ve yıl şeklinde güncelleniyor.
          const commentDate = new Date(row.commentDate); 
          const month = months[commentDate.getMonth()];
          const year = commentDate.getFullYear();
        
          return {
            userNickname: row.userNickname,
            commentContents: row.commentContents,
            commentDate: `${month} ${year}`, // Ay ve yıl bilgisini kullanarak tarihi oluşturuluyor.
            commentScore: row.commentScore,
            commentTitle: row.commentTitle,
            userProfilePic: "./images/avatar.jpeg",
            locationName: row.locationName,
            locationLink: "/location?id=" + row.locationID,
          };
        });
      
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

  async function getTotalStarCounts(locationID) {
    try {
        const result = await client.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN "commentScore" = 1 THEN 1 ELSE 0 END), 0) AS total_star1,
                COALESCE(SUM(CASE WHEN "commentScore" = 2 THEN 1 ELSE 0 END), 0) AS total_star2,
                COALESCE(SUM(CASE WHEN "commentScore" = 3 THEN 1 ELSE 0 END), 0) AS total_star3,
                COALESCE(SUM(CASE WHEN "commentScore" = 4 THEN 1 ELSE 0 END), 0) AS total_star4,
                COALESCE(SUM(CASE WHEN "commentScore" = 5 THEN 1 ELSE 0 END), 0) AS total_star5
            FROM 
                comments
            WHERE 
                "locationID" = $1;
        `, [locationID]);

        // Veritabanından gelen sonuçları al
        const starCounts = {
            totalStar1: result.rows[0].total_star1,
            totalStar2: result.rows[0].total_star2,
            totalStar3: result.rows[0].total_star3,
            totalStar4: result.rows[0].total_star4,
            totalStar5: result.rows[0].total_star5
        };

        // Sonuçları geri döndür
        return starCounts;

    } catch (err) {
        console.error('Hata oluştu:', err);
        // Hata durumunda null döndür
        return null;
    }
  }

  const getLocationType = async () => {
    try {

      const query1 = {
          text: `
          SELECT
              "locationType"
          FROM
              locations
          GROUP BY
              "locationType"
          LIMIT 8
          `
      };
      const result1 = await client.query(query1);
      locationTypes = result1.rows;
      return locationTypes
  } catch (error) {
    console.error("Error fetching comment data:", error);
    throw error; 
    }
  }

const getTypeLocationData = async (locationtype,cityIDArray) => {
  try {
    const locationType = locationtype;
    const cityIDs = cityIDArray;
    const cityIdString = cityIDs.join(', '); 
    const query2 = {
        text: `
            SELECT DISTINCT
              locations."locationName"  
            FROM
                locations
            WHERE "locationType" = $1 AND "locationCityID" IN (${cityIdString})
            ORDER BY 
              locations."locationName" DESC
        `,
        values: [locationType],
    };
    const result = await client.query(query2);
    const locationNames = result.rows;
    return locationNames
} catch (error) {
    console.error("Error fetching comment data:", error);
    throw error; 
  }
}

const getActiveTypeLocationData = async (userLocationtype,cityIDArray) => {
  try {
    const userChoices = [];
    userLocationtype.forEach((isTrue, index) => {
      if (isTrue) {
        userChoices.push(locationTypes[index].locationType);
      }
    });
    const userChoicesString = userChoices.map(userChoice => `'${userChoice}'`).join(', ');

    const cityIDs = cityIDArray;
    const cityIdString = cityIDs.join(', '); 

    const query2 = {
        text: `
          SELECT DISTINCT
            locations."locationName"  
          FROM
            locations
          WHERE 
            "locationType" IN (${userChoicesString}) AND 
            "locationCityID" IN (${cityIdString})
          ORDER BY 
            locations."locationName" DESC
        `,
    };
    const result = await client.query(query2);
    const locationNames = result.rows;
    return locationNames
  
} catch (error) {
    console.error("Error fetching comment data:", error);
    throw error; 
  }
}

const getSelectedLocationData = async (userLocationtype,cityIDArray) => {
  try {
    const userChoices = [];
    userLocationtype.forEach((isTrue, index) => {
      if (isTrue) {
        userChoices.push(locationTypes[index].locationType);
      }
    });
    const userChoicesString = userChoices.map(userChoice => `'${userChoice}'`).join(', ');

    const cityIDs = cityIDArray;
    const cityIdString = cityIDs.join(', '); 

    const query2 = {
        text: `
          SELECT 
            * 
          FROM
            locations
          WHERE 
            "locationType" IN (${userChoicesString}) AND 
            "locationCityID" IN (${cityIdString})
          ORDER BY 
            locations."locationName" DESC
        `,
    };
    const result = await client.query(query2);
    const selectedLocationsData = result.rows;
    return selectedLocationsData;
  
} catch (error) {
    console.error("Error fetching comment data:", error);
    throw error; 
  }
}

const getLocationCoordinates = async (locationName) => {
  try {

    const result = await client.query(
      `
      SELECT 
          "locationCoordinates",
          "locationID"
      FROM 
          locations
      WHERE 
          "locationName" = $1;
      `, 
      [locationName]);

    const coordinates = result.rows[0].locationCoordinates;
    const parts = coordinates.split(",");
    const locationCoordinatesLat = parts[0].trim();
    const locationCoordinatesLong = parts[1].trim();
    
    const locationCoordinates = {
      locationCoordinatesLat : locationCoordinatesLat,
      locationCoordinatesLong : locationCoordinatesLong,
      locationID : result.rows[0].locationID
    }
    return locationCoordinates

} catch (error) {
    console.error("Error fetching comment data:", error);
    throw error; 
  }
}

const getRoutesData = async (routeID) => {
  try {
    const result = await client.query(
      `
      SELECT 
          *
      FROM 
          routes
      WHERE 
          "routeID" = $1;
      `, 
      [routeID]
    );
    const routeData = {
      routeCreationDate: result.rows[0].routeCreationDate,
      routeCitiyIDs: result.rows[0].routeCities,
      userID: result.rows[0].userID,
      routeTitle: result.rows[0].routeTitle,
      routeStartDates: result.rows[0].routeStartDates,
      ruteFinishDates: result.rows[0].ruteFinishDates,
      routeChoices: result.rows[0].routeChoices,
      routeLocations: result.rows[0].routeLocations
    }
    return routeData; // routes tablosundaki her veriyi döndürür

  } catch (error) {
    console.error("Error fetching route data:", error);
    throw error; 
  }
}



const getCities = async () => {
  try {
    const query = `
                  SELECT 
                    "cityName"
                    FROM 
                    cities 
                `;

  const result = await client.query(query);

  if (result.rows.length > 0) {
    const cities = result.rows.map(row => ({
      cityName : row.cityName
    }));

    return cities;
    }
    else {
      return null; // Return null if no data found
    }
  } catch (error) {
    console.error("Error fetching cities data:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
}

const controlRouteID = async (userID, routeID) => {
  try {
    const query = `
      SELECT 
        *
      FROM 
        routes 
      WHERE 
        "userID" = $1
        AND "routeID" = $2
    `;

    const result = await client.query(query, [userID, routeID]);

    // Eğer dönen satır varsa, rota bulunmuştur, true döndür
    return result.rows.length;
  } catch (error) {
    console.error("Rotayı kontrol ederken bir hata oluştu:", error);
    throw error; // Hatanın dışarıya fırlatılması, çağrıcı tarafından yakalanması için
  }
};
const getProfileInfo = async(sessionuserId) =>{
  try {
    const result2 = await client.query('SELECT "userName", "userSurname","userPhoneNo","userMail", "userImg" FROM users WHERE "userID" = $1', [sessionuserId]);
    if (result2.rows.length > 0) {
      const userName = result2.rows[0].userName;
      const userSurname = result2.rows[0].userSurname;
      const userPhoneNo = result2.rows[0].userPhoneNo;
      const userMail = result2.rows[0].userMail;
      const userImg = result2.rows[0].userImg;
      return [userName, userSurname,userPhoneNo,userMail, userImg];
    } else {
      return null; // Return null if no data found
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
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
    getUserData,
    getTotalStarCounts,
    getLocationType,
    getTypeLocationData,
    getActiveTypeLocationData,
    getLocationCoordinates,
    getRoutesData,
    getCities,
    controlRouteID,
    getSelectedLocationData,
    getProfileInfo
    
  };