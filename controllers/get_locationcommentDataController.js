const client = require("../database.js");

exports.get_locationcommentData = async (req, res) => {
    try {
      const start_index = parseInt(req.query.start_index) || 0;
      const num_record = parseInt(req.query.num_record) || 10;
      const locationID = req.query.locationID;
      
  
      const query = {
        text: `
              SELECT
                comments.*,
                users."userNickname",
                users."userCountry", 
                users."userCity", 
                users."userCommentCount", 
                users."userImg"
              FROM 
                comments
              INNER JOIN 
                users 
              ON 
                comments."userID" = users."userID"
              WHERE
              comments."locationID" = $3
              ORDER BY comments."commentID"
              OFFSET $1
              LIMIT $2;
              `,
        values: [start_index, num_record, locationID]
    };
      
      const result = await client.query(query);
    
  
      res.json(result.rows); // Sonuçları JSON olarak gönderme
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Internal Server Error");
    }
  }