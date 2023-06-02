const express = require("express");
const dataSchema = require("./../Middlewares/validations/dataSchema");
const controller = require("./../Controllers/childController");
const validator = require("./../Middlewares/validations/validatorMW");
const { isAdmin } = require("./../Middlewares/Auth/authMWPremissions");

const router = express.Router();
router
  .route("/child")
  .get(controller.getAllchildrens)
  .post(isAdmin, dataSchema.postChildArray, validator, controller.addNewchild)
  .patch(
    isAdmin,
    dataSchema.patchChildArray,
    validator,
    controller.updateChildById
  )
  .delete(isAdmin, controller.deleteChildById);

router
  .route("/child/:id")
  .get(dataSchema.validateIntegerParameter, validator, controller.getChildById);

router
  .route("/child/:id/class")
  .get(
    dataSchema.validateIntegerParameter,
    validator,
    controller.getChildClassInfo
  );

module.exports = router;

// childRoute
// app.get('/child', function (req, res) {
//     res.json({message:"GET child"});
//   })

// app.get('/child/:id', function (req, res) {
// res.json({message:"GET a child by ID "})
// })
// app.get('/child/:id/class', function (req, res) {
// res.json({message:"GET a child class info by ID "})
// })

// app.post('/child', function (req, res) {
// res.json({message:"POST child"});
// })

// app.patch('/child/:id', function (req, res) {
// res.json({message:"PATCH child"});
// })

// app.delete('/child/:id', function (req, res) {
// res.json({message:"DELETE child"});
// })
