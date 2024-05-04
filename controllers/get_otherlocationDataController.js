const client = require("../database.js");

exports.get_otherLocationData = async (req, res) => {
    try {
      const start_index = parseInt(req.query.start_index) || 0;
      const num_record = parseInt(req.query.num_record) || 10;
      const locationType = req.query.locationType;
  
      const query = {
                text:  `SELECT 
                        locations.*,
                        cities."cityName"
                    FROM 
                        locations
                    INNER JOIN 
                        cities ON locations."locationCityID" = cities."cityID"
                    WHERE 
                        locations."locationType" = $3
                    ORDER BY 
                        locations."locationScore" DESC,
                        locations."locationName" DESC
                    OFFSET $1 
                    LIMIT $2;
                `,
                  values: [start_index, num_record, locationType],
              };
      const result = await client.query(query);
  
      res.json(result.rows); // Sonuçları JSON olarak gönderme
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Internal Server Error");
    }
  }