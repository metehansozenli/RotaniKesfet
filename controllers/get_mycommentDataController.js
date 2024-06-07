const client = require("../database.js");

exports.get_mycommentData = async (req, res) => {
  try {
    const start_index = parseInt(req.query.start_index) || 0;
    const num_record = parseInt(req.query.num_record) || 5;
    const userID = req.query.userID;

    if (!userID) {
      res.status(400).send("userID is required");
      return; // Ensure the function exits after sending the response
    }

    const query = {
      text: `
            SELECT
              comments.*,
              locations."locationID",
              locations."locationImg",
              locations."locationName",
              locations."locationCountry",
              locations."locationType",
              cities."cityName"
            FROM 
              comments
            INNER JOIN 
              users 
            ON 
              comments."userID" = users."userID"
            INNER JOIN
              locations
            ON
              comments."locationID" = locations."locationID"
            INNER JOIN
              cities
            ON
              locations."locationCityID" = cities."cityID"
            WHERE
              comments."userID" = $1
            OFFSET $2
            LIMIT $3;
            `,
      values: [userID, start_index, num_record]
    };
    
    const result = await client.query(query);
    res.json(result.rows); // Send results as JSON and ensure function exits
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};
