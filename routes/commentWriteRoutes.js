const express = require("express");
const router = express.Router();
const session = require("express-session"); // express-session middleware'ini ekledik
const commentWriteController = require("../controllers/commentWriteController");

// Oturum middleware'ini rotaya ekle
router.use(session({
  secret : "gizli_kelime",
  resave : false,
  saveUninitialized : false
}));

// getLocationController ile rotayı ilişkilendir
router.get("/commentWrite", commentWriteController.commentwriteController);

module.exports = router;