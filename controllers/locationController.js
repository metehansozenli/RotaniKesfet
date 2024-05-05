const veritabani = require("./indexController")
exports.getLocationController = async (req, res) => {
    try {
      
      const locationData = await veritabani.getSpecifiedLocationData(req.query.id);
      const totalStarCounts = await veritabani.getTotalStarCounts(req.query.id);
      res.render("location", { locationData: locationData , totalStarCounts:totalStarCounts});
    } catch (error) {
      console.error("Location acilirlen hata olustu:", error);
      res.status(500).send("Internal Server Error");
    }
  }