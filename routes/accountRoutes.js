const express = require("express")
const router = express.Router()

const accountController = require("../controllers/accountController")


router.post("/login", accountController.postLogin)

router.post("/register", accountController.postRegister)

router.get("/logout", accountController.Logout)

router.get("/changeHeader", accountController.changeHeader)


module.exports =router;