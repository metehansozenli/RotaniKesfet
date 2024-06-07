const veritabani = require("./indexController")

exports.FavLocations = async (req, res) => {
    
    const userSession = req.session;
   
        try {
            
            const userFavLocation = await veritabani.getUserFavouriteLocations(userSession.userID);
            const userID = userSession.userID;
            
            if (userFavLocation && userID) {
               
                res.render("favlocation", {
                    userData : userFavLocation,
                    userID: userID
                    
                });
            } else {
                res.render("page404");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.render("page404");
        }
    
}
   