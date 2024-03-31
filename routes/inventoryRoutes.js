// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const regValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Router to build inventory by detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

//Routet to build the error 500 view
router.get("/error500", utilities.handleErrors(invController.buildError500));

//Router to build the management view
router.get(
  "/management",
  utilities.handleErrors(invController.buildManagement)
);

// Router to build the add_classification
router.get(
  "/add_classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Router to build the add_vehicle
router.get(
  "/add_vehicle",
  utilities.handleErrors(invController.buildAddVehicle)
);

// Router to register a new classification vehicle
router.post(
  "/add_classification",
  regValidate.newClassificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.registerClassification)
);

// router to regist a new vehicle
router.post(
  "/add_vehicle",
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.registerVehicle)
);

module.exports = router;
