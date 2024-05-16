const express = require("express")
const router = express.Router()

const citylocationData = require("../controllers/get_citiesController")

router.get("/get_Cities", citylocationData.get_Cities)
module.exports = router