const veritabani = require("./indexController")
exports.getIndexController = async (req, res) => {
    try {
      const userID = req.session.userID;
      const randomCitiesData = await veritabani.getRandomCitiesData();
      const randomCitiesData2 = await veritabani.getRandomCitiesData();
      const restaurantData = await veritabani.getRestaurantData();

      res.render("index",  { randomCitiesData: randomCitiesData, randomCitiesData2 : randomCitiesData2, restaurantData:restaurantData, userID :userID});
    } catch (error) {
      console.error("index acilirken hata olustu:", error);
      res.render("page404");
    }
  }