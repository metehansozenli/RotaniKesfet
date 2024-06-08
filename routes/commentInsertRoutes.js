const express = require("express");
const router = express.Router();
const session = require("express-session"); // express-session middleware'ini ekledik
const commentInsertController = require("../controllers/commentInsertController");

// getLocationController ile rotayı ilişkilendir
router.get("/commentInsert", commentInsertController.commentInsertController);

module.exports = router;