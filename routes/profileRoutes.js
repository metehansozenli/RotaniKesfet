const express = require("express");
const router = express.Router();
const session = require("express-session"); // express-session middleware'ini ekledik
const getProfileController = require("../controllers/profileController");

// Oturum middleware'ini rotaya ekle
router.use(session({
  secret : "gizli_kelime",
  resave : false,
  saveUninitialized : false
}));

// getLocationController ile rotayı ilişkilendir
router.get("/profile", getProfileController.changeProfile);

module.exports = router;