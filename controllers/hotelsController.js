const veritabani = require("./indexController")
exports.hotels = async (req, res) => {
    try {
      const commentsData = await veritabani.getCommentData("hotel");
      res.render("hotels", {commentsData: commentsData});
    } catch (error) {
      console.error("Hotelsi acilirken hata olustu:", error);
      res.status(500).send("Internal Server Error");
    }
  }