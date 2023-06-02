const express = require("express");
const controller = require("./../Controllers/authenticationController");
const router = express.Router();
const dataSchema = require("./../Middlewares/validations/dataSchema");
const validator = require("./../Middlewares/validations/validatorMW");

router.post(
  "/register",
  dataSchema.postTeacherArray,
  validator,
  controller.registerNewTeacher
);

router.post("/login", dataSchema.loginArray, validator, controller.login);

module.exports = router;
