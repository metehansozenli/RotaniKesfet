const veritabani = require("./indexController")
exports.DeleteRoute = async (req, res) => {
    try {
        const {
            routeID 
        } = req.body;

        await veritabani.deleteRoute(routeID);
        res.render("myroutes");
    } catch (error) {
        console.error("Silerken hata olustu:", error);
        res.render("page404");
    }
  }