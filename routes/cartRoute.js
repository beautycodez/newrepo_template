// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const cartCont = require("../controllers/cartController");




// Route to build the Cart View 
router.get("/list", utilities.checkLogin, utilities.handleErrors(cartCont.buildCartView) )


// Route to build the Cart list 
router.get("/list/:account_id", utilities.checkLogin, utilities.handleErrors(cartCont.buildCartListView) )

// Route to add a cart to the cart List
router.get ("/link_add_cart/:inv_id", utilities.checkLogin, utilities.handleErrors(cartCont.addCart)), 

// route to delete a cart from the cart list
router.get ("/delete/:cart_id", utilities.checkLogin, utilities.handleErrors(cartCont.deleteItem))

module.exports = router;
