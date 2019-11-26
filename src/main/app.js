const express = require("express");
const helmet = require("helmet");
const mustacheExpress = require("mustache-express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");

// init objection
require("./common/objection");

// init express
var app = express();

var project_root = path.join(__dirname, "../..");

app.engine("html", mustacheExpress());

app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(
  "/css",
  sassMiddleware({
    src: path.join(project_root, "public/scss"),
    dest: path.join(project_root, "public/css"),
    indentedSyntax: false,
    sourceMap: true,
    debug: false
  })
);
app.use(express.static(path.join(project_root, "public")));
app.use(function(req, res, next) {
  var pathname = req.path.split("/");
  var breadcrumbs = [];
  if (pathname.length != 0) {
    if (pathname[0] === "") pathname.shift();
    if (pathname[pathname.length - 1] === "") pathname.pop();
    breadcrumbs.push({
      name: pathname[0],
      url: "/" + pathname[0] // get the complete URL for the site here
    });
    for (var i = 1; i < pathname.length; i++) {
      if (pathname[i] === "") pathname = pathname.splice(i, 1);
      breadcrumbs.push({
        name: pathname[i],
        url: breadcrumbs[i - 1].url + "/" + pathname[i] // get the complete URL for the site here
      });
    }
    breadcrumbs[breadcrumbs.length - 1].last = true;
    console.log(breadcrumbs);
    req.breadcrumbs = breadcrumbs;
  }
  next();
});
app.use("/", require("./routes/index"));
app.use("/login", require("./routes/login"));
app.use("/course", require("./routes/course"));

module.exports = app;
