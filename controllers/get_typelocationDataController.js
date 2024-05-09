const client = require("../database.js");

exports.get_typeLocationData = async (req, res) => {
    try {
        const locationType = req.query.locationType; // locationType parametresini al
        console.log(locationType);
        const query2 = {
            text: `
                SELECT DISTINCT
                    "locationName"
                FROM
                    locations
                WHERE "locationType" = $1
                ORDER BY 
                    "locationName" DESC
            `,
            values: [locationType],
        };
        const result2 = await client.query(query2);
        const locationNames = result2.rows;
        console.log(locationNames)
        res.json(locationNames); // Sonuçları JSON olarak gönder

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}
