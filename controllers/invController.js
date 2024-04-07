const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    isAuthenticated,
    grid,
  });
};

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const data_detail = await invModel.getInventoryDetailById(inv_id);
  const detail = await utilities.buildInventoryDetail(data_detail);
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const makeName = data_detail[0].inv_make;
  const modelName = data_detail[0].inv_model;
  res.render("./inventory/detail", {
    title: makeName + " " + modelName + " vehicle",
    nav,
    isAuthenticated,
    detail,
  });
};
invCont.buildError500 = async function (req, res, next) {
  const data_error = await invModel.getItemFromDataBase();
  // const item_error = await utilities.buildItemError(data_error)
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const errorName = "Error 500";
  res.render("./errors/error500", {
    title: errorName,
    nav,
    isAuthenticated,
    item_error,
  });
};
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const classificationList = await utilities.buildClassificationList();
  const managment_name = "Managment";
  res.render("./inventory/management", {
    title: managment_name,
    nav,
    isAuthenticated,
    classificationList,
  });
};
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const add_classification_name = "Add a New Classification";
  res.render("./inventory/add_classification", {
    title: add_classification_name,
    nav,
    isAuthenticated,
    errors: null,
  });
};
invCont.buildAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const classificationList = await utilities.buildClassificationList();
  const add_classification_name = "Add a New Vehicle";
  res.render("./inventory/add_vehicle", {
    title: add_classification_name,
    nav,
    isAuthenticated,
    classificationList,
    errors: null,
  });
};
invCont.registerClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const add_classification_name = "Add a New Classification";
  const classificationList = await utilities.buildClassificationList();
  const classification_name = req.body.classification_name;
  const regResult = await invModel.registerClassification(classification_name);
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have registered ${regResult.rows[0].classification_name}. Add a new vehicle`
    );
    res.status(201).render("./inventory/management", {
      title: add_classification_name,
      nav,
      isAuthenticated,
      errors: null,
      classificationList,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./inventory/add_classification", {
      title: "Registration",
      nav,
      isAuthenticated,
      errors,
    });
  }
};
invCont.registerVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const classificationList = await utilities.buildClassificationList();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  const add_classification_name = "Add a New Vehicle";
  const regResult = await invModel.registerVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have registered ${inv_make} ${inv_model}. Add a new vehicle`
    );
    res.status(201).render("./inventory/management", {
      title: add_classification_name,
      nav,
      isAuthenticated,
      errors: null,
      classificationList,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./inventory/add_vehicle", {
      title: "Registration",
      nav,
      isAuthenticated,
      classificationList,
      errors,
    });
  }
};
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};
// ***********************
// Build the edit view
// ***********************
invCont.buildEditView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const inv_id = parseInt(req.params.inv_id);
  const inv_data = await invModel.getInventoryDetailById(inv_id);
  let inv_make = inv_data[0].inv_make;
  let inv_model = inv_data[0].inv_model;
  const classification_id = inv_data[0].classification_id;
  const classificationList = await utilities.buildClassificationList(
    classification_id
  );
  res.render("./inventory/edit_inventory", {
    title: "Edit" + " " + inv_make + " " + inv_model,
    nav,
    isAuthenticated,
    classificationList,
    errors: null,
    inv_id: inv_data[0].inv_id,
    inv_make: inv_data[0].inv_make,
    inv_model: inv_data[0].inv_model,
    inv_year: inv_data[0].inv_year,
    inv_description: inv_data[0].inv_description,
    inv_image: inv_data[0].inv_image,
    inv_thumbnail: inv_data[0].inv_thumbnail,
    inv_price: inv_data[0].inv_price,
    inv_miles: inv_data[0].inv_miles,
    inv_color: inv_data[0].inv_color,
    classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/management");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      isAuthenticated,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
    });
  }
};
// The Delete View can be displayed from here
invCont.buildDeleteView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const inv_id = parseInt(req.params.inv_id);
  const inv_data = await invModel.getInventoryDetailById(inv_id);
  let inv_make = inv_data[0].inv_make;
  let inv_model = inv_data[0].inv_model;
  res.render("./inventory/delete_confirmation", {
    title: "Delete" + " " + inv_make + " " + inv_model,
    nav,
    isAuthenticated,
    errors: null,
    inv_id,
    inv_make: inv_data[0].inv_make,
    inv_model: inv_data[0].inv_model,
    inv_year: inv_data[0].inv_year,
    inv_price: inv_data[0].inv_price,
  });
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  const inv_id = parseInt(req.body.inv_id);
  const { inv_make, inv_model } = req.body;
  const deleteItem = await invModel.deleteInventoryItem(inv_id);

  if (deleteItem) {
    const itemName = inv_make + " " + inv_model;
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/management");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).redirect(`/inv/delete/${inv_id}`, {
      title: "Edit " + itemName,
      nav,
      isAuthenticated,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

module.exports = invCont;
