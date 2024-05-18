const client = require("../database.js");
const veritabani = require("./indexController");

exports.get_Cities = async (req, res) => {
    try {
        const cities = await veritabani.getCities();
        res.json(cities); // Sonuçları JSON olarak gönder
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}
