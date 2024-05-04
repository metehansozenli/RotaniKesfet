const express = require("express")
const router = express.Router()

const getLocationController = require("../controllers/locationController")

router.get("/hotels", getLocationController.getLocationController)
module.exports = router