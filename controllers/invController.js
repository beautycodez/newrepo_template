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

module.exports = invCont
