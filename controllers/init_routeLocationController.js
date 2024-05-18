const client = require("../database.js");
const veritabani = require("./indexController");

exports.init_routeLocationData = async (req, res) => {
    try {
        const routeID = req.query.routeID;
        const routeData = await veritabani.getRoutesData(routeID);
        const routeCityIDs = routeData.routeCitiyIDs;
        const userLocationType = routeData.routeChoices;
        const locationData = await veritabani.getSelectedLocationData(userLocationType, routeCityIDs);
        res.json({locationData: locationData, routeData: routeData}); // Sonuçları JSON olarak gönder
        
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}
