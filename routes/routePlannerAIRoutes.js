const express = require("express")
const router = express.Router()

const AI_Data = require("../controllers/routeplannerAIController")

router.get("/get_AI_Data", AI_Data.routeplannerAIController)
module.exports = router