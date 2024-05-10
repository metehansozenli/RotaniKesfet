const express = require("express")
const router = express.Router()

const locationCoordinates = require("../controllers/get_locationCoordinatesDataController")

router.get("/get_locationCoordinates", locationCoordinates.get_LocationCoordinates)
module.exports = router