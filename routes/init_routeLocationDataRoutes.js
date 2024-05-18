const express = require("express")
const router = express.Router()

const route_locationData = require("../controllers/init_routeLocationController")

router.get("/init_routelocationData", route_locationData.init_routeLocationData)
module.exports = router