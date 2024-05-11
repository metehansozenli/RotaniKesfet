const express = require("express");
const router = express.Router();
const session = require("express-session"); // express-session middleware'ini ekledik
const getroutePlannerController = require("../controllers/routePlannerController")

// Oturum middleware'ini rotaya ekle
router.use(session({
  secret : "gizli_kelime",
  resave : false,
  saveUninitialized : false
}));

// getLocationController ile rotayı ilişkilendir
router.get("/routePlanner", getroutePlannerController.routePlannerController);

module.exports = router;