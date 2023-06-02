const mongoose = require("mongoose");
require("./../Models/teacherModel");
require("dotenv").config();
const Teacher = mongoose.model("teachers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerNewTeacher = function (request, response, next) {
  // check already exists
  Teacher.findOne({ email: request.body.email })
    .then((data) => {
      if (!data) {
        // 1. create new teacher
        let { fullName, password, email, image, isAdmin } = request.body;
        // 2. hashing password using bcrypt
        const salt = bcrypt.genSaltSync(2);
        password = bcrypt.hashSync(password, salt);

        let object = new Teacher({
          fullName,
          password,
          email,
          image,
          isAdmin,
        });

        object
          .save()
          .then((data) => {
            // 3. send response with jwt Token
            const token = jwt.sign(
              { userId: data._id, isAdmin: data.isAdmin },
              process.env.SECRET_KEY
            );
            response.status(200).json({ token });
          })
          .catch((error) => next(error));
      } else {
        throw new Error("Teacher already exists");
      }
    })
    .catch((error) => next(error));
};

exports.login = function (request, response, next) {
  Teacher.findOne({ email: request.body.email })
    .then((data) => {
      //1. check email exists or not
      if (!data) throw new Error("Invalid email..");

      //2. check password
      const validPassword = bcrypt.compareSync(
        request.body.password,
        data.password
      );
      if (!validPassword) throw new Error("wrong password..");

      // 3. send response with jwt Token
      const token = jwt.sign(
        { userId: data._id, isAdmin: data.isAdmin },
        process.env.SECRET_KEY
      );
      response.status(200).json({ token });
    })
    .catch((error) => next(error));
};
