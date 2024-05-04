const veritabani = require("./indexController")
exports.getIndexController = async (req, res) => {
    try {
      const randomCitiesData = await veritabani.getRandomCitiesData();
      res.render("index", { randomCitiesData: randomCitiesData });
    } catch (error) {
      console.error("index acilirken hata olustu:", error);
      res.status(500).send("Internal Server Error");
    }
  }