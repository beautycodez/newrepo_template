const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


/* ***************************
 *  Get all details of the item by inventory_id
 * ************************** */
async function getInventoryDetailById(inventory_id) {
  try {
    const data_detail = await pool.query(
      `SELECT * FROM
          public.inventory
       WHERE
          inv_id = $1`,
       [inventory_id]   
    )
    return data_detail.rows
  } catch (error) {
    console.error("getinventorydetailbyid error " + error)
  }
}

async function getItemFromDataBase(){
  try {
    const data_errors = await pool.query(
      `SELECT * FROM
          public.inventory
       WHERE
          inv_id = 1`     
    )
    return data_errors.rows
  } catch (error) {
    console.error("getinventorydetailbyid error " + error)
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryDetailById, getItemFromDataBase};