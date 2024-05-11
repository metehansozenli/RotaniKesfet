const client = require("../database.js");
const veritabani = require("./indexController");

exports.get_cityLocationData = async (req, res) => {
    try {
        const locationTypes = await veritabani.getLocationType();
        res.json(locationTypes); // Sonuçları JSON olarak gönder
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}
