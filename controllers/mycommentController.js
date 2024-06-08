const veritabani = require("./indexController");

exports.mycommentController = async (req, res) => {
  try {
    // Oturumdan userID'yi al
    const userID = req.session.userID;

    

    if(!userID){
        res.render("page404");
    }else{

      const totalStarCounts = await veritabani.getUserTotalStarCounts(userID);
      const randomLocation = await veritabani.getRandomLocation();

      console.log(totalStarCounts)
      
      res.render("mycomment", { 
        userID: userID, // Oturumdan alınan kullanıcı kimliğini şablon verilerine ekleyin
        totalStarCounts: totalStarCounts,
        randomLocation : randomLocation
      });
    }

    

  } catch (error) {
    console.error("mycomment açılırken hata oluştu:", error);
    res.render("page404");
  }
};