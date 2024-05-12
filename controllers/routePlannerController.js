    const veritabani = require("./indexController");

    exports.routePlannerController = async (req, res) => {
        try {
            const routeID = req.session.routeID;
            let userID; // userID'yi tanımlıyoruz
            if (req.session.userID) {
                userID = req.session.userID;
            }
          
                // userID varsa ve routesData varsa render yap
                if (userID) {
                    res.render("routePlanner", { routeID: routeID, userID: userID });
                } else {
                    res.render("page404"); // userID yoksa veya routesData yoksa 404 sayfasına yönlendir
                }
            
      
        } catch (error) {
            console.error("RoutePlanneri açılırken hata oluştu:", error);
            res.render("page404");
        }
    };
    