const express = require("express")
const router = express.Router()

const createtravel = require("../controllers/createTravelController")

router.post("/createTravel", createtravel.createTravel)
module.exports = router