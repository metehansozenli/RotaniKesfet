const express = require("express")
const router = express.Router()


const getRestaurantController = require("../controllers/restaurantController")

router.get("/restaurants", getRestaurantController.restaurantController)
module.exports = router