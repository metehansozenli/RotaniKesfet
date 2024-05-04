
const client = require("../database.js");





exports.get_popDestData = async (req, res) => {
    try {
      const start_index = parseInt(req.query.start_index) || 0;
      const num_record = parseInt(req.query.num_record) || 10;
  
      const query = {
                text: `SELECT 
                        cities.*, 
                        ARRAY_AGG(locations."locationName") AS "locationNames", 
                        ARRAY_AGG(locations."locationID") AS "locationIDs"
                    FROM 
                        cities 
                    LEFT JOIN (
                        SELECT *
                        FROM locations
                        WHERE "locationScore" IN (
                            SELECT DISTINCT "locationScore"
                            FROM locations
                            ORDER BY "locationScore" DESC
                            LIMIT 5
                        )
                    ) AS locations ON cities."cityID" = locations."locationCityID" 
                    GROUP BY 
                        cities."cityID" 
                    ORDER BY 
                        cities."cityScore" DESC, 
                        cities."cityName" DESC 
                    OFFSET $1 
                    LIMIT $2;
                `,
                  values: [start_index, num_record],
              };
      const result = await client.query(query);
  
      res.json(result.rows); // Sonuçları JSON olarak gönderme
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Internal Server Error");
    }
  }