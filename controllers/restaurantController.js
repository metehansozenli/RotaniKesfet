/* const veritabani = require("./indexController")
exports.restaurantController = async (req, res) => {
    try {
      const commentsData = await veritabani.getCommentData("restaurant");
      res.render("restaurants", {commentsData: commentsData});
    } catch (error) {
      console.error("Restauranti acilirken hata olustu:", error);
      res.status(500).send("Internal Server Error");
    }
  } */
  const veritabani = require("./indexController");

exports.restaurantController = async (req, res) => {
  try {
   
    const userID = req.session.userID;
    
   
    try {
      const commentsData = await veritabani.getCommentData("restaurant");
      res.render("restaurants", {commentsData: commentsData, userID: userID});
    } catch (error) {
      console.error("Restauranti acilirken hata olustu:", error);
      res.status(500).send("Internal Server Error");
    }

    console.log(userID); // userID'yi kullanabilirsiniz
  } catch (error) {
    console.error("Restaurant açılırken hata oluştu:", error);
    res.status(500).send("Internal Server Error");
  }
};