    const veritabani = require("./indexController");

    exports.routePlannerController = async (req, res) => {
        try {
            const routeID = req.session.routeID;
            let routeTitle
            let userID; // userID'yi tanımlıyoruz
            if (req.session.userID) {
                userID = req.session.userID;
            }
          
            try {
                const routesData = await veritabani.getRoutesData(routeID);
                // userID varsa ve routesData varsa render yap
                if (userID && routesData) {
                    res.render("routePlanner", { routesData: routesData, userID: userID });
                } else {
                    res.render("page404"); // userID yoksa veya routesData yoksa 404 sayfasına yönlendir
                }
            } catch (error) {
                console.error("RoutePlanneri acilirken hata olustu:", error);
                res.render("page404");
            }
      
        } catch (error) {
            console.error("RoutePlanneri açılırken hata oluştu:", error);
            res.render("page404");
        }
    };
    