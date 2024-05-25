const veritabani = require("./indexController")

exports.FavLocations = async (req, res) => {
    
    const userSession = req.session;
   
        try {
            
            const userFavLocation = await veritabani.getUserFavouriteLocations(userSession.userID);
             console.log("sorguuuu", userFavLocation[0])
          
            if (userFavLocation) {
               
                res.render("favlocation", {
                    userData : userFavLocation

                    
                });
            } else {
                res.send("Bir hata Oluştu!");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.render("page404");
        }
    
}
   