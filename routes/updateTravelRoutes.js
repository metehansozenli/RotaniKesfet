const express = require("express")
const router = express.Router()

const updatetravel = require("../controllers/updateTravelController")

router.post("/updateTravel", updatetravel.updatetravel)
module.exports = router