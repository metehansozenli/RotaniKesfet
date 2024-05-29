const client = require("../database.js");

exports.createTravel = async (req, res) => {
    try {
        const {
          routeCreationDate,
          routeTitle,
          routeStartDates,
          routeFinishDates,
          userID,
          routeChoices,
          cityIDs
        } = req.body;
        
         
        // routes tablosuna ekleme işlemi
        const routeInsertQuery =  `
                                  INSERT INTO 
                                    routes ("routeCreationDate", "routeTitle", "userID", "routeCities", "routeStartDates", "routeFinishDates","routeChoices")
                                  VALUES 
                                    ($1, $2, $3, $4, $5, $6, $7)
                                  RETURNING "routeID";
                                  `;
    
        const routeValues = [routeCreationDate, routeTitle, userID, cityIDs, routeStartDates, routeFinishDates, routeChoices];
        const result = await client.query(routeInsertQuery, routeValues);
        const newRouteID = result.rows[0].routeID;
        
    
        res.status(200).json({ success: true, newRouteID:newRouteID });
        
        
      } catch (error) {
        console.error('Error creating travel:', error);
        res.status(500).json({ success: false, error: 'An error occurred' });
      }
}