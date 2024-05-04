const express = require("express")
const router = express.Router()

const popDestData = require("../controllers/get_popDestDataController")

router.get("/get_popDestData", popDestData.get_popDestData)
module.exports = router