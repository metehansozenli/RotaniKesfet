const express = require("express");
const router = express.Router();
const session = require("express-session"); // express-session middleware'ini ekledik
const myroutesController = require("../controllers/myroutesController");

// Oturum middleware'ini rotaya ekle
router.use(session({
  secret : "gizli_kelime",
  resave : false,
  saveUninitialized : false
}));


router.get("/myroutes", myroutesController.MyRoutes);

module.exports = router;