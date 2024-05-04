const express = require("express")
const router = express.Router()

const otherlocationData = require("../controllers/get_otherlocationDataController")

router.get("/get_otherlocationData", otherlocationData.get_otherLocationData)
module.exports = router