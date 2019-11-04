var express = require("express");
var mustache = require("../common/mustache");
var querystring = require("querystring");

var router = express.Router();

/* GET login page */
router.get("/", function(req, res, next) {
  var error = null;
  if (req.query.error) error = req.query.error;
  res.render("base_template", {
    title: "Login",
    body: mustache.render("login", { error: error })
  });
});

/* POST login page */
router.post("/", (req, res, next) => {
  // hard coded username and password
  if (req.body.username === "user" && req.body.password === "password") {
    res.redirect(302, "/course/");
  } else {
    const query = querystring.stringify({
      error: "Invalid username and password!"
    });
    res.redirect(302, "/login?" + query);
  }
});

module.exports = router;
