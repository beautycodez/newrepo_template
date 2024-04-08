const pool = require("../database/");

async function getCartDetailsById(account_id) {
  try {
    const sql =
      "select * FROM inventory AS i JOIN cart AS ca ON i.inv_id = ca.inv_id JOIN  account AS a ON a.account_id = ca.account_id WHERE a.account_id = $1 ";
    const result = await pool.query(sql, [account_id]);

    return result.rows;
  } catch (error) {
    console.error("getcartDetailsById error " + error);
  }
}

async function addCart(inv_id, account_id) {
    try {
        const sql = `INSERT INTO public.cart (inv_id, account_id)
        VALUES ($1, $2) RETURNING *;`
        const data = await pool.query(sql, [inv_id, account_id])
        return data.rows
    }catch (error) {
        console.error("model error: " + error)
      }      
}

async function deleteItem(cart_id) {
    try {
        const sql = "delete from cart where cart_id = $1 RETURNING *;"
        const result = await pool.query(sql, [cart_id])
        return result.rows
    }catch (error) {
        console.error("model error:" + error)
    }
}

module.exports = { getCartDetailsById, addCart, deleteItem };
