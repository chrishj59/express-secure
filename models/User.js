const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// derfine model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// on Save Hook, encrypt password
// Before save, this function
userSchema.pre("save", async function(next) {
  // get access to instance of user model

  const user = this;

  // generate a salt then run callback
  // bcrypt.genSalt(10, function(err, salt) {
  //   if (err) {
  //     return next(err);
  //   }
  //   //hash password using the salt
  //   bcrypt.hash(user.password, salt, function(err, hash) {
  //     if (err) {
  //       return next(err);
  //     }
  //     // overwrite plain text password with encrypted password
  //     user.password = hash;
  //     console.log("In hook password is ${user.password}");
  //     // save the model
  //     next();
  // });
  //});
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

//Instance method added
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};
//create model class
const ModelClass = mongoose.model("user", userSchema);

//export model class
module.exports = ModelClass;
