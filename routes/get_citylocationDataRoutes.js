const express = require("express")
const router = express.Router()

const citylocationData = require("../controllers/get_citylocationDataController")

router.get("/get_citylocationData", citylocationData.get_cityLocationData)
module.exports = router