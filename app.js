var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
let Hbs = require("handlebars");
const Razorpay = require("razorpay");
const nodemailer =require("nodemailer");
const fs = require('fs');


const puppeteer = require("puppeteer")





var userRouter = require("./routes/user");
var adminRouter = require("./routes/admin");
var hotelRouter = require("./routes/hotel");
var app = express();


var session = require("express-session");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "Layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials",
  })
);


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: 'Key', cookie: { maxAge: 60000000 } }))


const razorpayInstance = new Razorpay({
  key_id: "rzp_test_8cTRaG2qyqmSGG",
  key_secret: "lPhtD4Guxq3dUurYJLs9OwXi"
});



app.use((req, res, next) => {
  res.set('cache-control', 'no-store')
  next()
})
// app.use(fileupload());

app.use("/", userRouter);

app.use("/admin", adminRouter);

app.use("/hotel",hotelRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;
