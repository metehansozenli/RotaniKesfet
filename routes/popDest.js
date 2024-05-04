const express = require("express")
const router = express.Router()

const getPopdestController = require("../controllers/popdestController")

router.get("/popdest", getPopdestController.PopDestController)
module.exports = router