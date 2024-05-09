
const veritabani = require("./indexController")
exports.PopDestController = async (req, res) => {
    try {
      const commentsData = await veritabani.getCommentData("popdest");
      res.render("popdest", { commentsData: commentsData });
    } catch (error) {
      console.error("Popdest acilirken hata olustu:", error);
      res.render("page404");
    }
  }