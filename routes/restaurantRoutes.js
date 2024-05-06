/* const express = require("express")
const router = express.Router()


const getRestaurantController = require("../controllers/restaurantController")

router.get("/restaurants", getRestaurantController.restaurantController)
module.exports = router */

const express = require("express");
const router = express.Router();
const session = require("express-session"); // express-session middleware'ini ekledik
const getRestaurantController = require("../controllers/restaurantController")

// Oturum middleware'ini rotaya ekle
router.use(session({
  secret : "gizli_kelime",
  resave : false,
  saveUninitialized : false
}));

// getLocationController ile rotayı ilişkilendir
router.get("/restaurants", getRestaurantController.restaurantController)

module.exports = router;