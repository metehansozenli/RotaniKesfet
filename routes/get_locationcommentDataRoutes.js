const express = require("express")
const router = express.Router()

const locationcommentData = require("../controllers/get_locationcommentDataController")

router.get("/get_locationcommentData", locationcommentData.get_locationcommentData)
module.exports = router