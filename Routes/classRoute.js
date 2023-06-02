const express = require("express");
const dataSchema = require("./../Middlewares/validations/dataSchema");
const controller = require("./../Controllers/classController");
const validator = require("./../Middlewares/validations/validatorMW");
const { isAdmin } = require("./../Middlewares/Auth/authMWPremissions");

// classRoute
const router = express.Router();
router
  .route("/class")
  .get(controller.getAllClasses)
  .post(isAdmin, dataSchema.postClassArray, validator, controller.addNewClass)
  .patch(
    isAdmin,
    dataSchema.patchClassArray,
    validator,
    controller.updateClassByID
  )
  .delete(isAdmin, controller.deleteClassByID);

router
  .route("/class/:id")
  .get(dataSchema.validateIntegerParameter, validator, controller.getClassByID);

router
  .route("/class/:id/child")
  .get(
    dataSchema.validateIntegerParameter,
    validator,
    controller.getClassChildInfo
  );

router
  .route("/class/:id/teacher")
  .get(
    isAdmin,
    dataSchema.validateIntegerParameter,
    validator,
    controller.getClassSupervisorInfo
  );

module.exports = router;

// app.get('/class', function (req, res) {
//     res.json({message:"GET all classes"});
//   })
//   app.get('/class/:id', function (req, res) {
//     res.json({message:"GET a class by ID "})
//   })
//   app.post('/class', function (req, res) {
//     res.json({message:"POST class"});
//   })

//   app.patch('/class/:id', function (req, res) {
//     res.json({message:"PATCH class"});
//   })

//   app.delete('/class/:id', function (req, res) {
//     res.json({message:"DELETE a class"});
//   })
//   app.get('/class/:id/child', function (req, res) {
//     res.json({message:"GET class childen info"});
//   })

//   app.get('/class/:id/teacher', function (req, res) {
//     res.json({message:"GET class supervisor info"});
//   })
