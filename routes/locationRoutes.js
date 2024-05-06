const express = require("express");
const router = express.Router();
const session = require("express-session"); // express-session middleware'ini ekledik
const getLocationController = require("../controllers/locationController");

// Oturum middleware'ini rotaya ekle
router.use(session({
  secret : "gizli_kelime",
  resave : false,
  saveUninitialized : false
}));

// getLocationController ile rotayı ilişkilendir
router.get("/location", getLocationController.getLocationController);

module.exports = router;