const express = require("express")
const router = express.Router()

const locationNameData = require("../controllers/get_locationNameController")

router.get("/get_locationNames", locationNameData.get_LocationNames)
module.exports = router