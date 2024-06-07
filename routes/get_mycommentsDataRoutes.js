const express = require("express")
const router = express.Router()

const mycommentsData = require("../controllers/get_mycommentDataController")

router.get("/get_mycommentData", mycommentsData.get_mycommentData)
module.exports = router