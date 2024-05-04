const veritabani = require("./indexController")
exports.restaurantController = async (req, res) => {
    try {
      const commentsData = await veritabani.getCommentData("restaurant");
      res.render("restaurants", {commentsData: commentsData});
    } catch (error) {
      console.error("Restauranti acilirken hata olustu:", error);
      res.status(500).send("Internal Server Error");
    }
  }