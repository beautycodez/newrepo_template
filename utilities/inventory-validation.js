const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */

validate.inventoryRules = () => {
  return [
    // make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the vehicle make with at least 3 characters"), // on error this message is sent.

    // model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the vehicle model with at least 3 characters."), // on error this message is sent.

    // valid year is required and cannot already exist in the DB
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .withMessage("The inventory year must be exactly 4 digits."),

    // image is required and must be strong password
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      // .isEmail()
      // .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid inv_image is required."),

    // thumbnail is required and must be strong password
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      // .isEmail()
      // .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid inv_thumbnail is required."),

    // price is required and must be strong password
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid inv_price is required."),

    // miles is required and must be strong password
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please enter the vehicle miles")
      .isInt()
      .withMessage("The miles should be an integer number and have at least 4 ."),

    // color is required and must be strong password
    body("inv_color")
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
    body("inv_description")
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
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
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
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classificationList
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    inv_id,
    classification_id,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/edit_inventory", {
      errors,
      title: "Update" + " "+ inv_make + " " + inv_model,
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classificationList,
      inv_id
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
