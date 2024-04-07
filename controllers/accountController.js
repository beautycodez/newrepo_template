const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const accountController = {};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Build the login view
accountController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;

  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    isAuthenticated,
  });
};
/* ****************************************
 *  Deliver registration view
 * *************************************** */
accountController.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    isAuthenticated,
  });
};

/* ****************************************
 *  Process Registration
 * *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      isAuthenticated,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      isAuthenticated,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors,
      isAuthenticated,
    });
  }
};

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  let isAuthenticated = req.cookies.jwt ? true : false;
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      isAuthenticated,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Ops, it looks like your email address or password are incorrect")
      res.render("/account/login", {
        isAuthenticated,
        nav,
        errors: null,
      });
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
};

accountController.buildManagement = async function (req, res) {
  let nav = await utilities.getNav();
  const account_firstname = res.locals.accountData.account_firstname;
  const account_id = res.locals.accountData.account_id;
  const account_type = res.locals.accountData.account_type;
  let isAuthenticated = req.cookies.jwt ? true : false;
  req.flash("notice", `Welcome`);
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    isAuthenticated,
    account_firstname,
    account_type,
    account_id,
  });
};

/* ****************************************
 *  Log out from account
 * ************************************ */
accountController.logOut = async function (req, res) {
  let nav = await utilities.getNav();
  const isAuthenticated = req.cookies.jwt ? true : false;
  console.log(isAuthenticated);
  res.clearCookie("jwt");
  req.flash("notice", "You have logged out successfully");
  res.render("./index", {
    title: "Homepage",
    nav,
    errors: null,
    isAuthenticated,
  });
};
/* ****************************************
 *  Build the account update view
 * ************************************ */
accountController.buildAccountUpdateView = async function (req, res) {
  let nav = await utilities.getNav();
  const account_email = res.locals.accountData.account_email;
  const isAuthenticated = req.cookies.jwt ? true : false;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (accountData) {
    res.render("./account/update_account", {
      title: "Update your account",
      nav,
      isAuthenticated,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
};

/* ****************************************
 *  Update the account
 * ************************************ */
accountController.updateAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const isAuthenticated = req.cookies.jwt ? true : false;
  const account_id = res.locals.accountData.account_id;
  const { account_email, account_firstname, account_lastname } = req.body;
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_email,
    account_firstname,
    account_lastname
  );
  if (updateResult) {
    const itemName =
      updateResult.account_firstname + " " + updateResult.account_lastname;
    req.flash("notice", `${itemName} account was successfully updated.`);
    res.redirect("/account/");
  } else {
    const itemName =
      updateResult.account_firstname + " " + updateResult.account_lastname;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("./account/management", {
      title: "Edit " + itemName,
      nav,
      isAuthenticated,
      errors: null,
    });
  }
};

/* ****************************************
 *  Update the account
 * ************************************ */
accountController.updatePassword = async function (req, res) {
  let nav = await utilities.getNav();
  const isAuthenticated = req.cookies.jwt ? true : false;
  const account_id = res.locals.accountData.account_id;
  const { account_firstname, account_lastname, account_type } =
    res.locals.accountData;
  const { account_password } = req.body;
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/management", {
      title: "Registration",
      nav,
      errors: null,
      isAuthenticated,
      account_firstname,
      account_type,
    });
  }
  // update the password in the database
  const regResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve updated your password ${account_firstname} ${account_lastname}. Please log in.`
    );
    res.status(201).render("account/management", {
      title: "Login",
      nav,
      errors: null,
      isAuthenticated,
      account_firstname,
      account_type,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/management", {
      title: "Registration",
      nav,
      errors,
      isAuthenticated,
      account_firstname,
      account_type,
    });
  }
};

module.exports = accountController;
