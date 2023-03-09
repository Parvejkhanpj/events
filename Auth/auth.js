const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.register = async (req, res) => {
  const { password, email, fname, lname } = req.body;
  try {
    if (!email || !password || !fname) {
      return res.status(403).json({ error: "Please enter a email, password" });
    }
    var regexEmail = /\S+@\S+\.\S+/;
    if (email) {
      if (!regexEmail.test(email)) {
        return res.status(400).json({
          error: "email is invalid",
        });
      }
    }
    // password hashing
    password = bcrypt.hashSync(password, 8);
    const userSearch = await User.find({ email: email });
    if (userSearch) {
      return res.status(403).json({ error: "email is already registered" });
    } else {
      const user = new User(req.body);
      await user.save((err, user) => {
        if (err) {
          res.status(400).status({ error: err.message });
        }

        res.status(200).json({ success: "OK", data: user });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ phone_number: phone_number }).exec((err, user) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    if (!user) {
      return res.status(404).send({
        error: "User not found.",
      });
    }

    //comparing passwords
    var passwordIsValid = bcrypt.compareSync(password, user.encry_password);

    // checking if password was valid and send response accordingly
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    const { _id, email, fName } = user;

    return res.status(200).json({
      token,
      user: {
        _id, fName, email
      },
    });
  });
};
