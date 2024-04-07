const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const action = req.body.action || req.query.action;
  if (action === "logout") {
    let nav = await utilities.getNav();
    const isAuthenticated = req.cookies.jwt ? true : false;
    console.log(isAuthenticated);
    res.clearCookie("jwt");
    req.flash("notice", "You have logged out successfully");
    res.status(201).render("./index", {
      isAuthenticated,
      title: "Homepage",
      nav,
      errors: null,
    })
    ;
  } else {
    const nav = await utilities.getNav();
    let isAuthenticated = req.cookies.jwt ? true : false;
    res.render("index", {
      title: "Home",
      nav,
      isAuthenticated,
    });
  }
};

module.exports = baseController;
