/*
This file contains the updated user model including functions for authentication.
*/
const mongoose = require("mongoose");
const crypto = require("crypto");


/*
 User schema, has an email, name, hashed password, role, and a reset password link.
*/
const user2Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
      select: false,
    },
    salt: String,
    role: {
      type: String,
      default: "Regular",
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/*
Create a virtual password and encrypt it.
*/
user2Schema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

/*
Method for encrpyting the password and checking if the encrypted password matches the hashed password.
*/
user2Schema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("User2", user2Schema);
