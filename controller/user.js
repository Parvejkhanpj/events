const bcrypt = require("bcrypt");
const { User } = require("../models/user");
require('dotenv').config()


exports.register = async (req, res) => {
  let { password, email, fname, lname } = req.body;
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
    // console.log(password, "passowrd");
    const userSearch = await User.findOne({ email: email })
    console.log(userSearch, "usersearc")
    if (userSearch) {
      return res.status(403).json({ error: "email is already registered" });
    } else {
    const user = new User({
      email: email,
      password: password,
      fName: fname,
      lName: lname,
    });

    user.save()
    console.log(user, "user");
    res.json(user);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  let { email, password } = req.body;

  const user = await User.findOne({ email: email });
  console.log(user, "user")

  //comparing passwords
  var passwordIsValid = bcrypt.compareSync(password, user.password);

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
  // const { _id, email, fName } = user;

  return res.status(200).json({
    token,
    user: {
      _id: user._id,
      fname:user.fName,
      email,
    },
  });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
