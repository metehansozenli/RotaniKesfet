const veritabani = require("./indexController")

exports.denemeController = async (req, res) => {
    try {
      const commentsData = await veritabani.getCommentData("popdest");
      res.render("deneme", { commentsData: commentsData });
    } catch (error) {
      console.error("Popdest acilirken hata olustu:", error);
      res.status(500).send("Internal Server Error");
    }
  }