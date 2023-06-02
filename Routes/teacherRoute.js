const express = require("express");
const dataSchema = require("./../Middlewares/validations/dataSchema");
const controller = require("./../Controllers/teacherController");
const validator = require("./../Middlewares/validations/validatorMW");
const { isAdmin } = require("./../Middlewares/Auth/authMWPremissions");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });
// teacherRoute
const router = express.Router();
router.route("/teachers/supervise").get(controller.getAllSupervisors);

router
  .route("/teachers")
  .all(isAdmin)
  .get(controller.getAllTeachers)
  .post(dataSchema.postTeacherArray, validator, controller.addNewTeacher)
  .patch(dataSchema.patchTeacherArray, validator, controller.updateTeacherById)
  .delete(controller.deleteTeacherById);

router
  .route("/teachers/:id")
  .get(
    dataSchema.validateMongoIdParameter,
    validator,
    controller.getTeacherById
  );

router
  .route("/teachers/:id/profile")
  .post(upload.single("avatar"), controller.updateTeacherAvatar);

module.exports = router;

// app.get('/teachers/supervise', function (req, res) {
//     res.json({message:"GET all teacher supervisors"});
// })

// app.get('/teachers', function (req, res) {
// res.json({message:"GET teachers"});
// })

// app.post('/teachers', function (req, res) {
// res.json({message:"POST teachers"});
// })
// app.patch('/teachers', function (req, res) {
// res.json({message:"PATCH teachers"});
// })

// app.delete('/teachers/:id', function (req, res) {
// res.json({message:"DELETE a specified teacher"});
// })

// app.get('/teachers/:id', function (req, res) {
//     res.json({message:"GET a teacher by ID "})
//     })
