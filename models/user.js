const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
    },
    lName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique:true,
    },
    password: {
      type: String,
      required: true,
    },
    sports: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = {User};
