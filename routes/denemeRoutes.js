const express = require("express")
const router = express.Router()

const getDenemeController = require("../controllers/denemeController")

router.get("/deneme", getDenemeController.denemeController)
module.exports = router