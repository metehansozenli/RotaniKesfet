const client = require("../database.js");
const veritabani = require("./indexController");

exports.init_routeLocationData = async (req, res) => {
    try {
        const routeID = req.query.routeID;
        const routeData = await veritabani.getRoutesData(routeID);
        res.json(routeData); // Sonuçları JSON olarak gönder
        
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}
