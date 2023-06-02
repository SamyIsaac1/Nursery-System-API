const mongoose = require("mongoose");
require("./../Models/classModel");
require("./../Models/childModel");
const Class = mongoose.model("classes");
const Child = mongoose.model("childrens");
exports.getAllClasses = function (request, response, next) {
  Class.find({}, { __v: 0 })
    .then((data) => {
      if (data.length == 0) throw new Error("No Classes exist");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.addNewClass = function (request, response, next) {
  let { _id, name, supervisor, children } = request.body;
  Child.find({ _id: { $in: children } })
    .then((data) => {
      let dataIds = data.map((d) => d._id);
      if (dataIds.length !== children.length) {
        let wrongIds = children.filter((id) => !dataIds.includes(id)).join(",");
        throw new Error(`these ids don't exist ${wrongIds}`);
      }
      return data;
    })
    .then(() => {
      let object = new Class({ _id, name, supervisor, children });

      object
        .save()
        .then((data) => {
          response.json(data);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
};

exports.getClassByID = function (request, response, next) {
  Class.findById(request.params.id)
    .then((data) => {
      if (!data) throw new Error("No Class exists by this ID");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.updateClassByID = function (request, response, next) {
  let newClass = {};
  for (prop in request.body) {
    newClass[prop] = request.body[prop];
  }

  Class.findByIdAndUpdate(request.body._id, newClass, { new: true })
    .then((data) => {
      if (!data) throw new Error("No Classes exist by this ID");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.deleteClassByID = function (request, response, next) {
  Class.findByIdAndDelete(request.body._id)
    .then((data) => {
      if (!data) throw new Error("No Classes exist by this ID");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.getClassChildInfo = function (request, response, next) {
  Class.findById(request.params.id, { _id: 0, __v: 0 })
    .populate([
      { path: "children", select: { _id: 0, __v: 0 } },
      { path: "supervisor", select: { password: 0, _id: 0, __v: 0 } },
    ])
    .then((data) => {
      if (!data) throw new Error("No Classes exist by this ID");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.getClassSupervisorInfo = function (request, response, next) {
  Class.findById(request.params.id, { _id: 0, __v: 0, children: 0 })
    .populate({
      path: "supervisor",
      select: { password: 0, _id: 0, __v: 0 },
    })
    .then((data) => {
      if (!data) throw new Error("No Classes exist by this ID");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};
