const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */

validate.inventoryRules = () => {
  return [
    // make is required and must be string
    body("inventory_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the vehicle make with at least 3 characters"), // on error this message is sent.

    // model is required and must be string
    body("inventory_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the vehicle model with at least 3 characters."), // on error this message is sent.

    // valid year is required and cannot already exist in the DB
    body("inventory_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .withMessage("The inventory year must be exactly 4 digits."),

    // image is required and must be strong password
    body("inventory_image")
      .trim()
      .escape()
      .notEmpty()
      // .isEmail()
      // .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid inv_image is required."),

    // thumbnail is required and must be strong password
    body("inventory_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      // .isEmail()
      // .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid inv_thumbnail is required."),

    // price is required and must be strong password
    body("inventory_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid inv_price is required."),

    // miles is required and must be strong password
    body("inventory_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please enter the vehicle miles")
      .isInt()
      .withMessage("The miles should be an integer number and have at least 4 ."),

    // color is required and must be strong password
    body("inventory_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid inv_color is required."),

    // classification is required and must be strong password
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid classification_id is required."),

    // desctiption is required and must be strong password
    body("inventory_description")
      .trim()
      .escape()
      .notEmpty()
      // .isEmail()
      // .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid inv_description is required."),
  ];
};

validate.newClassificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .notEmpty().withMessage("Please enter the classification name")
        .isAlphanumeric().withMessage("The classification name must contain only alphanumeric characters.")
    ]   
};
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inventory_make,
    inventory_model,
    inventory_year,
    inventory_description,
    inventory_image,
    inventory_thumbnail,
    inventory_price,
    inventory_miles,
    inventory_color,
    classification_id,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/add_vehicle", {
      errors,
      title: "Add Inventory",
      nav,
      inventory_make,
      inventory_model,
      inventory_year,
      inventory_description,
      inventory_image,
      inventory_thumbnail,
      inventory_price,
      inventory_miles,
      inventory_color,
      classification_id,
      classificationList
    });
    return;
  }
  next();
};
validate.checkClassificationData = async (req, res, next) => {
    const classification_name = req.body;
    let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add_classification", {
      errors,
      title: "Add Inventory",
      nav,
      classification_name
    });
    return;
  }
  next();
}

module.exports = validate;
