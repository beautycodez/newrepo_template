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
    (req, res) => {
      res.status(200).send('login process')
    }
  )
module.exports = router;
