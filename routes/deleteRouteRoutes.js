const express = require("express")
const router = express.Router()

const deleteroute = require("../controllers/deleteRouteController")

router.post("/deleteRoute", deleteroute.DeleteRoute)
module.exports = router