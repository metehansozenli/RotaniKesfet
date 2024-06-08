const veritabani = require("./indexController");

exports.commentwriteController = async (req, res) => {
  try {
    // Oturumdan userID'yi al
    const userID = req.session.userID;
    const locationID = req.query.id;

    if(!userID){
        res.render("page404");
    }else{
      const locationData = await veritabani.getSpecifiedLocationData(locationID);
      res.render("commentWrite", { 
        userID: userID, // Oturumdan alınan kullanıcı kimliğini şablon verilerine ekleyin
        locationID: locationID,
        locationName: locationData.locationName,
        locationImg: locationData.locationImg
      });
    }

    

  } catch (error) {
    console.error("commentWrite açılırken hata oluştu:", error);
    res.render("page404");
  }
};