const express = require("express")
const router = express.Router()

const typelocationData = require("../controllers/get_typelocationDataController")

router.get("/get_typelocationData", typelocationData.get_typeLocationData)
module.exports = router