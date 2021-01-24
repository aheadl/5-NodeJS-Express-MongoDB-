var createError = require("http-errors");
var express = require("express");
var path = require("path");
//var cookieParser = require("cookie-parser");
var logger = require("morgan");
//Add express session
//const session = require("express-session");
//const FileStore = require("session-file-store")(session);
//passport & authenticate
const passport = require("passport");
//const authenticate = require("./authenticate");
const config = require("./config");

const mongoose = require("mongoose");
//const url = "mongodb://localhost:27017/nucampsite";
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

const campsiteRouter = require("./routes/campsiteRouter");
const promotionRouter = require("./routes/promotionRouter");
const partnerRouter = require("./routes/partnerRouter");
const favoriteRouter = require("./routes/favoriteRouter");

const uploadRouter = require("./routes/uploadRouter");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
//added for https
// Secure traffic only
app.all('*', (req, res, next) => {
    if (req.secure) {
      return next();
    } else {
        console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
        res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
    }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev")); //logs every http request
app.use(express.json()); //parses data from request body
app.use(express.urlencoded({ extended: false })); //parses url 
//Remove cookieParser since using Express session
//app.use(cookieParser("12345-67890-09876-54321"));

// app.use(
//   session({
//     name: "session-id",
//     secret: "12345-67890-09876-54321",
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore(),
//   })
// );

//add passport initialize
 app.use(passport.initialize());
// app.use(passport.session());


app.use("/", indexRouter);
app.use("/users", usersRouter);
//<-------------------Add authentication here--------------------------------
// Write custom middleware function auth
// function auth(req, res, next) {
//   // console.log(req.headers);
//   console.log(req.user);
//   //if cookie is not properly signed - cookie not included - means client has not been authenticated
//   // if (!req.signedCookies.user) {
//   // if (!req.session.user) {
//     if (!req.user) {
//       // const authHeader = req.headers.authorization;
//       // if (!authHeader) {
//       const err = new Error("You are not authenticated - no signed cookies!");
//       //res.setHeader("WWW-Authenticate", "Basic");
//       err.status = 401;
//       return next(err);
//       //}
//       //When there is an authorization header
//       //Don't need to require Buffer - you can just use it
//       // const auth = Buffer.from(authHeader.split(" ")[1], "base64")
//       //   .toString()
//       //   .split(":");
//       // //parse username and password from auth constant
//       // const user = auth[0];
//       // const pass = auth[1];
//       // if (user === "admin" && pass === "password") {
//       //   //set up a cookie if user authenticated
//       //   //res.cookie("user", "admin", { signed: true }); //3rd param optional - tells Express to use a signed key
//       //   req.session.user = "admin";
//       //   return next(); // authorized - pass control to the next middleware function
//       // } else {
//       //   const err = new Error("You are not authenticated - login incorrect!");
//       //   res.setHeader("WWW-Authenticate", "Basic");
//       //   err.status = 401;
//       //   return next(err);
//       // }
//     } else {
//       //if (req.signedCookies.user === "admin") {
//      //if (req.session.user === "authenticated") {
//         return next(); // pass client to next middleware function
//     //   } else {
//     //     const err = new Error(
//     //       "You are not authenticated - signed cookie user is not admin!"
//     //     );
//     //     err.status = 401;
//     //     return next(err);
//     //   }
//     // }
// }
// }

//app.use(auth);

app.use(express.static(path.join(__dirname, "public")));
//Move this above auth function so that users can access the router (since we have way for users to register) before they are authenticated. We want unauth users to access the routers as well, to be able to create an account
// app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use("/campsites", campsiteRouter);
app.use("/promotions", promotionRouter);
app.use("/partners", partnerRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favorites", favoriteRouter);

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
