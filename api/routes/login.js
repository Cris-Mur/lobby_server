var express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

var router = express.Router();
const tokenSeed = process.env.tokenSeed;
const tokenExpire = process.env.tokenExpire;

router.post("/", function (req, res, next) {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        console.log("email or password incorrect");
        res.status(400).json({ message: "email or password incorrect" });
      } else {
        let userToken = jwt.sign(
          { _id: user._id , 
            role: user.role,
            username: user.username,
            avatar: user.avatar,}, tokenSeed, {
          expiresIn: tokenExpire,
        });
        res.status(200).json({
          message: 'Login Success',
          user: user,
          accessToken: userToken,
        });
        console.log("login success");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
module.exports = router;
