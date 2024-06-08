const client = require("../database.js");
const veritabani = require("./indexController");

exports.updatetravel = async (req, res) => {
    try {
        const {
          routeLocations,
          routeChoices,
          routeID 
        } = req.body;
        
        
      // routes tablosuna ekleme işlemi
      const query = {
        text: `
          UPDATE 
            routes
          SET 
            "routeLocations" = $1,
            "routeChoices" = $2
          WHERE
            "routeID" = $3
        `,
        values: [routeLocations, routeChoices, routeID],
      };
      await client.query(query);
        
      } catch (error) {
        console.error('Error updating travel:', error);
        res.status(500).json({ success: false, error: 'An error occurred' });
      }
}