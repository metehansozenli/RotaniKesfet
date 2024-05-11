const client = require("../database.js");
const veritabani = require("./indexController");

exports.get_typeLocationData = async (req, res) => {
    try {
        const locationType = req.query.locationType; // locationType parametresini al
        const locationNames = await veritabani.getTypeLocationData(locationType);
        res.json(locationNames); // Sonuçları JSON olarak gönder

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}
