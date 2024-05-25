const express = require("express");
const router = express.Router();
const session = require("express-session"); // express-session middleware'ini ekledik
const getfavLocationController = require("../controllers/favlocationController");

// Oturum middleware'ini rotaya ekle
router.use(session({
  secret : "gizli_kelime",
  resave : false,
  saveUninitialized : false
}));


router.get("/favlocation", getfavLocationController.FavLocations);

module.exports = router;