// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Router to build inventory by detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

//Routet to build the error 500 view
router.get("/error500", utilities.handleErrors(invController.buildError500));

module.exports = router;