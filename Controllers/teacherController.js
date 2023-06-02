const mongoose = require("mongoose");
require("./../Models/teacherModel");
require("./../Models/classModel");
const Teacher = mongoose.model("teachers");
const Class = mongoose.model("classes");
const path = require("path");

exports.getAllSupervisors = function (request, response, next) {
  //all class supervisors.
  Class.find({}, { name: 1, _id: 0 })
    .populate([{ path: "supervisor", select: { fullName: 1, _id: 0 } }])
    .then((data) => {
      if (data.length == 0) throw new Error("No Teachers exist");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.getAllTeachers = function (request, response, next) {
  Teacher.find()
    .then((data) => {
      if (data.length == 0) throw new Error("No Teachers exist");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.addNewTeacher = function (request, response, next) {
  let { fullName, password, email, image, isAdmin } = request.body;
  let object = new Teacher({ fullName, password, email, image, isAdmin });

  object
    .save()
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.getTeacherById = function (request, response, next) {
  Teacher.findById(request.params.id)
    .then((data) => {
      if (!data) throw new Error("No Teachers exist by this ID");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.updateTeacherById = function (request, response, next) {
  let newTeacher = {};
  for (prop in request.body) {
    newTeacher[prop] = request.body[prop];
  }

  Teacher.findByIdAndUpdate(request.body._id, newTeacher, { new: true })
    .then((data) => {
      if (!data) throw new Error("No Teachers exist by this ID");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.deleteTeacherById = function (request, response, next) {
  Teacher.findByIdAndDelete(request.body._id)
    .then((data) => {
      if (!data) throw new Error("No Teachers exist by this ID");
      // response.status(200).json(data);
      return data;
    })
    .then((deletedTeacher) => {
      Class.findOneAndUpdate(
        { supervisor: request.body._id },
        { $unset: { supervisor: 1 } },
        { new: true }
      )
        .then((data) => {
          if (!data)
            response.status(200).json({
              message: "The Teacher has Deleted and he wasn't a supervisor",
            });
          // supervisor delete from a class
          response.status(200).json(data);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
};

exports.updateTeacherAvatar = function (request, response, next) {
  let newTeacher = {};

  for (prop in request.body) {
    newTeacher[prop] = request.body[prop];
  }

  newTeacher.image = path.join(__dirname, request.file.path);

  Teacher.findByIdAndUpdate(request.params.id, newTeacher, { new: true })
    .then((data) => {
      if (!data) throw new Error("No Teachers exist by this ID");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};
