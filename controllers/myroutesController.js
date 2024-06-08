const veritabani = require("./indexController")

exports.MyRoutes = async (req, res) => {
    
    const userSession = req.session;
   
        try {
            
            
            const userID = userSession.userID;
            
            if (userID) {
                const routeData = await veritabani.getRoutesAndRandomCityByUserID(userID);
                
                res.render("myroutes", {
                    //userData : userFavLocation,
                    userID: userID,
                    routeData: routeData
                });
            } else {
                res.render("page404");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.render("page404");
        }
    
}
   