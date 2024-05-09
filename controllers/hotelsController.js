/* const veritabani = require("./indexController")
exports.hotels = async (req, res) => {
    try {
      const commentsData = await veritabani.getCommentData("hotel");
      res.render("hotels", {commentsData: commentsData});
    } catch (error) {
      console.error("Hotelsi acilirken hata olustu:", error);
      res.status(500).send("Internal Server Error");
    }
  } */
  const veritabani = require("./indexController")
  exports.hotels = async (req, res) => {
    try {
      // Oturumdan userID'yi al
      const userID = req.session.userID;
      
     
      try {
        const commentsData = await veritabani.getCommentData("hotel");
        res.render("hotels", {commentsData: commentsData,  userID: userID});
      } catch (error) {
        console.error("Hotelsi acilirken hata olustu:", error);
        res.status(500).send("Internal Server Error");
      }
  
      console.log(userID); // userID'yi kullanabilirsiniz
    } catch (error) {
      console.error("Location açılırken hata oluştu:", error);
      res.render("page404");
    }
  };
