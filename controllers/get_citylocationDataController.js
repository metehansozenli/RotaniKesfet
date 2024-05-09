const client = require("../database.js");

exports.get_cityLocationData = async (req, res) => {
    try {
        // İlk sorgu: Tüm farklı lokasyon tiplerini al
        const query1 = {
            text: `
            SELECT
                "locationType"
            FROM
                locations
            GROUP BY
                "locationType"
            LIMIT 8
            `
        };
        const result1 = await client.query(query1);
        const locationTypes = result1.rows;
        res.json(locationTypes); // Sonuçları JSON olarak gönder

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}
