const veritabani = require("./indexController");

exports.getLocationController = async (req, res) => {
  try {
    // Oturumdan userID'yi al
    const userID = req.session.userID;

    const locationData = await veritabani.getSpecifiedLocationData(req.query.id);
    const totalStarCounts = await veritabani.getTotalStarCounts(req.query.id);

    res.render("location", { 
      locationData: locationData, 
      totalStarCounts: totalStarCounts, 
      userID: userID // Oturumdan alınan kullanıcı kimliğini şablon verilerine ekleyin
    });

  } catch (error) {
    console.error("Location açılırken hata oluştu:", error);
    res.status(500).send("Internal Server Error");
  }
};