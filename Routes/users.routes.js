const express = require("express");
const { userModel } = require("../Models/user.model");
const bcrypt = require("bcrypt");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

// registration route

userRouter.post("/register", async (req, res) => {
  const { name, email, password, gender, age, city, is_married } = req.body;

  const checkEmail = await userModel.find({ email });

  if (checkEmail.length === 0) {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) throw err;
      const data = new userModel({
        name,
        email,
        password: hash,
        gender,
        age,
        city,
        is_married,
      });
      await data.save();
    });
    res.status(200).send({ msg: "Registered successfully" });
  } else {
    res.status(400).send({ msg: "User already exists" });
  }
});

// login route

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjQyMTVkMGE5OGMzNjZjMDE1NGQ2YzkzIiwiaWF0IjoxNjc5OTA4ODA1fQ.QMj0PfxNw9xgw1Ktrl80ZKk3DUUTv8Nb1lb4lKZ9EcU

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const checkEmail = await userModel.find({ email });

  if (checkEmail.length > 0) {
    bcrypt.compare(password, checkEmail[0].password, function (err, result) {
      if (err) throw err;
      if (result) {
        const token = jwt.sign({ user: checkEmail[0]._id }, "post_management");
        res.status(200).send({ msg: "loggedIn successfully", token });
      } else {
        res.status(400).send({ msg: "Check Your Credentials" });
      }
    });
  } else {
    res.status(400).send({ msg: "User doesn't exists, please Sign Up" });
  }
});

module.exports = { userRouter };
