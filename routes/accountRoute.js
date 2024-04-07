const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route to build account login
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build account sign in
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
// Account-management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);
// Router to send data to the database
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// router log out
router.get("/logout", utilities.handleErrors(accountController.logOut) )

// router to build the account update view
router.get("/update_account",
utilities.handleErrors(accountController.buildAccountUpdateView))

// router update the account
router.post("/update_account",
utilities.handleErrors(accountController.updateAccount))

// router update the password
router.post("/update_password",
utilities.handleErrors(accountController.updatePassword))

module.exports = router;
