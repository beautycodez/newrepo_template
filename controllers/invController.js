const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data_detail = await invModel.getInventoryDetailById(inventory_id)
  const detail = await utilities.buildInventoryDetail(data_detail)
  let nav = await utilities.getNav()
  const makeName = data_detail[0].inv_make
  const modelName = data_detail[0].inv_model
  res.render("./inventory/detail", {
    title: makeName +" "+ modelName +  " vehicle",
    nav,
    detail,
  }) 
}
invCont.buildError500 = async function (req, res, next) {
  const data_error = await invModel.getItemFromDataBase()
  // const item_error = await utilities.buildItemError(data_error)
  let nav = await utilities.getNav()
  const errorName = 'Error 500'
  res.render("./errors/error500", {
    title: errorName,
    nav,
    item_error,
  }) 
}
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const managment_name = "Managment";
  res.render("./inventory/management",{
    title: managment_name,
    nav,
  })
}
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const add_classification_name = "Add a New Classification"
  res.render("./inventory/add_classification", {
    title: add_classification_name,
    nav,
    errors: null
  })
}
invCont.buildAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  const add_classification_name = "Add a New Vehicle"
  res.render("./inventory/add_vehicle", {
    title: add_classification_name,
    nav,
    classificationList,
    errors: null,
  })
}
invCont.registerClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const add_classification_name = "Add a New Classification"
  const classification_name = req.body.classification_name;
  const regResult = await invModel.registerClassification(
    classification_name
  
  );
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have registered ${regResult.rows[0].classification_name}. Add a new vehicle`
    );
    res.status(201).render("./inventory/management", {
      title: add_classification_name,
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./inventory/add_classification", {
      title: "Registration",
      nav,
      errors
    });
  }  
}
invCont.registerVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  const {
    classification_id,
    inventory_make,
    inventory_model,
    inventory_description,
    inventory_image,
    inventory_thumbnail,
    inventory_price,
    inventory_year,
    inventory_miles,
    inventory_color
  } = req.body;
  const add_classification_name = "Add a New Vehicle"
  const regResult = await invModel.registerVehicle(
    classification_id,
    inventory_make,
    inventory_model,
    inventory_description,
    inventory_image,
    inventory_thumbnail,
    inventory_price,
    inventory_year,
    inventory_miles,
    inventory_color
  );
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have registered ${inventory_make} ${inventory_model}. Add a new vehicle`
    );
    res.status(201).render("./inventory/management", {
      title: add_classification_name,
      nav,
      errors: null
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./inventory/add_vehicle", {
      title: "Registration",
      nav,
      classificationList,
      errors
    });
  }  
}
module.exports = invCont
