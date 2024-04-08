const cartModel = require("../models/cart-model");
const accountModel = require ("../models/account-model")
const utilities = require("../utilities");

const cartCont = {};

cartCont.buildCartView = async function (req, res){
    let nav = await utilities.getNav();
    let isAuthenticated = req.cookies.jwt ? true : false;
    const {account_email} = res.locals.accountData
    const accountResult = await accountModel.getAccountByEmail(account_email)
    if (accountResult){
        const account_id = res.locals.accountData.account_id
        const account_firstname = accountResult.account_firstname
        const my_cart_link = await utilities.buildCartLink(account_id, account_firstname)
        res.render("cart/cart_main", {
            title: "Cart Management View",
            nav,
            isAuthenticated,
            errors: null,
            my_cart_link,
    
        })
    }

    
}

cartCont.buildCartListView = async function (req, res) {
    let nav = await utilities.getNav();
    let isAuthenticated = req.cookies.jwt ? true : false;
    const {account_email} = res.locals.accountData
    const account_inf = await accountModel.getAccountByEmail(account_email)
    const account_id =account_inf.account_id 
    const cartResult = await cartModel.getCartDetailsById(account_id)
    if (cartResult){
        const cartGrid = await utilities.cartGrid(cartResult)
        res.render("cart/cart_list", {
            title: "My shooping cart",
            nav,
            isAuthenticated,
            errors: null,
            cartGrid,
        })
    }else{
        req.flash("notice", "I am sorry, there was an error")
        res.status(501).redirect("/cart/cart_main")
    }
}

cartCont.addCart = async function(req, res) {
    const inv_id = parseInt(req.params.inv_id)
    const {account_id} = res.locals.accountData

    const add_item_to_cart = await cartModel.addCart(inv_id, account_id)

    if(add_item_to_cart) {
        req.flash("notice", "You have added a car successfully")
        res.redirect("back")
    }else {
        req.flash("notice", "Sorry, We cannot added the item to your cart. Please, try again.")
        res.redirect("back")
    }
}

cartCont.deleteItem = async function(req, res) {
    const cart_id = parseInt(req.params.cart_id)
    const result = await cartModel.deleteItem(cart_id)
    req.flash("notice", "You have deleted a car successfully")
    res.status(201).redirect("back")
}
module.exports = cartCont;