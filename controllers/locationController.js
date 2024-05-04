const veritabani = require("./indexController")
exports.getLocationController = async (req, res) => {
    try {
      const locationData = await veritabani.getSpecifiedLocationData(req.query.id);
      res.render("location", { locationData: locationData });
    } catch (error) {
      console.error("Location acilirlen hata olustu:", error);
      res.status(500).send("Internal Server Error");
    }
  }