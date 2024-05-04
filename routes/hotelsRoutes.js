const express = require("express")
const router = express.Router()

const getHotelsController = require("../controllers/hotelsController")

router.get("/hotels", getHotelsController.hotels)
module.exports = router