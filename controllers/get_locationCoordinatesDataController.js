const client = require("../database.js");
const veritabani = require("./indexController");

exports.get_LocationCoordinates = async (req, res) => {
    try {
        const locationCoordinates = await veritabani.getLocationCoordinates(req.query.locationName);
        res.json(locationCoordinates); // Sonuçları JSON olarak gönder
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}