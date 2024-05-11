const express = require("express")
const router = express.Router()
const session = require("express-session"); // express-session middleware'ini ekledik


const getIndexController = require("../controllers/iController")
router.use(session({
    secret : "gizli_kelime",
    resave : false,
    saveUninitialized : false
  }));
router.get("/", getIndexController.getIndexController)



module.exports = router