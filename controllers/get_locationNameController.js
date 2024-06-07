const veritabani = require("./indexController");

exports.get_LocationNames = async (req, res) => {
    try {
        const locationIDString = req.query.locationID; 
        console.log(locationIDString);
        const locationIDs = locationIDString.split(',').map(Number); 
        console.log(locationIDs); 
        const locationDatas = await veritabani.getLocationName(locationIDs); 
        res.json(locationDatas); 


    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}
