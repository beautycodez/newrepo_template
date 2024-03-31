const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}




/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildInventoryDetail = async function(data_detail){
  let detail
  console.log(data_detail)
  if(data_detail.length > 0){
    detail = '<section class="detail_section">';
    detail += '<h1>' + data_detail[0].inv_year + " " +  data_detail[0].inv_make + " " + data_detail[0].inv_model + '</h1>'
    detail += '<img src="' + data_detail[0].inv_thumbnail 
    +'" alt="Image of '+ data_detail[0].inv_make + ' ' + data_detail[0].inv_model 
    +' on CSE Motors" />'
    detail += '<article>'
    detail += '<h4>' + data_detail[0].inv_year + " " +  data_detail[0].inv_make + " " + data_detail[0].inv_model + '</h4>'
    detail += '<p class="inv_price">Price: ' + "$" + new Intl.NumberFormat('en-US').format(data_detail[0].inv_price) + '</p>'
    detail += '<p class="inv_description">Description: ' + data_detail[0].inv_description + '</p>'
    detail += '<p class="inv_color">Color: ' + data_detail[0].inv_color + '</p>'
    detail += '<p class="inv_miles">Miles: ' + new Intl.NumberFormat('en-US').format(data_detail[0].inv_miles) + '</p>' 
    detail += '</article>'
    detail += '</section>'
  } else { 
    detail += '<p class="notice">Sorry, no matching vehicles details could be found.</p>'
  }
  return detail 
}

Util.buildItemError = async function(data_error, req, res, next){
  let error_message
  error_message += '<p> my error is ' + data_error[0].inv_color + '</p>'
  return error_message
}
/* ****************************************
 * Classification List for the Select and 
 * Options - Add vehicle view
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select class="bottom" name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util