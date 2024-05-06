/* const express = require("express")
const router = express.Router()

const getHotelsController = require("../controllers/hotelsController")

router.get("/hotels", getHotelsController.hotels)
module.exports = router */

const express = require("express");
const router = express.Router();
const session = require("express-session"); // express-session middleware'ini ekledik
const getHotelsController = require("../controllers/hotelsController")

// Oturum middleware'ini rotaya ekle
router.use(session({
  secret : "gizli_kelime",
  resave : false,
  saveUninitialized : false
}));

// getLocationController ile rotayı ilişkilendir
router.get("/hotels", getHotelsController.hotels);

module.exports = router;