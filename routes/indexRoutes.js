const express = require("express")
const router = express.Router()

const getIndexController = require("../controllers/iController")

router.get("/", getIndexController.getIndexController)

module.exports = router