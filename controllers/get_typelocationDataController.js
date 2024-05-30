const client = require("../database.js");
const veritabani = require("./indexController");

exports.get_typeLocationData = async (req, res) => {
    try {
        const locationType = req.query.locationType; // locationType parametresini al
        const routeID = req.query.routeID;
        const routeData = await veritabani.getRoutesData(routeID);
        const routeCityIDs = routeData.routeCityIDs;
        const userLocationType = routeData.routeChoices;
        const locationNames = await veritabani.getTypeLocationData(locationType, routeCityIDs);
        const locationNamesActive = await veritabani.getActiveTypeLocationData(userLocationType, routeCityIDs);
        res.json({ locationNames: locationNames, locationNamesActive: locationNamesActive }); // Sonuçları JSON olarak gönder

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}
