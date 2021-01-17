const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Added for passport
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  // username: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  // password: {
  //   type: String,
  //   required: true,
  // },
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  admin: {
    type: Boolean,
    default: false,
  },
});
userSchema.plugin(passportLocalMongoose); // provides addt'l authentication metho

module.exports = mongoose.model("User", userSchema);

