const express = require("express")
const router = express.Router()


const getAuthController = require("../controllers/authControllers")

router.post("/login", getAuthController.RegisterController)
router.post("/register", getAuthController.LoginController)
router.get("/logout", getAuthController.LogOutController)

module.exports = router

