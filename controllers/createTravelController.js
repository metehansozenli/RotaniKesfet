const client = require("../database.js");
const veritabani = require("./indexController");

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

        const temp = await veritabani.getLocationType();
        const locations = await veritabani.getSelectedLocationData(routeChoices, cityIDs);
        const routeLocations = locations.map(item => item.locationID);
        // routes tablosuna ekleme işlemi
        const routeInsertQuery =  `
                                  INSERT INTO 
                                    routes ("routeCreationDate", "routeTitle", "userID", "routeCities", "routeStartDates", "routeFinishDates","routeChoices", "routeLocations")
                                  VALUES 
                                    ($1, $2, $3, $4, $5, $6, $7, $8)
                                  RETURNING "routeID";
                                  `;
    
        const routeValues = [routeCreationDate, routeTitle, userID, cityIDs, routeStartDates, routeFinishDates, routeChoices, routeLocations];
        const result = await client.query(routeInsertQuery, routeValues);
        const newRouteID = result.rows[0].routeID;
        
    
        res.status(200).json({ success: true, newRouteID:newRouteID });
        
        
      } catch (error) {
        console.error('Error creating travel:', error);
        res.status(500).json({ success: false, error: 'An error occurred' });
      }
}