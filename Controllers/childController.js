const mongoose = require("mongoose");
require("./../Models/childModel");
require("./../Models/classModel");
const Child = mongoose.model("childrens");
const Class = mongoose.model("classes");
exports.getAllchildrens = function (request, response, next) {
  Child.find({}, { __v: 0 })
    .then((data) => {
      if (data.length == 0) throw new Error("No Childrens exist");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.addNewchild = function (request, response, next) {
  let { _id, fullName, age, level, address } = request.body;
  let object = new Child({ _id, fullName, age, level, address });

  object
    .save()
    .then((data) => {
      response.json(data);
    })
    .catch((error) => next(error));
};

exports.getChildById = function (request, response, next) {
  Child.findById(request.params.id)
    .then((data) => {
      if (!data) throw new Error("No Children exist by this ID");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.updateChildById = function (request, response, next) {
  Child.findById(request.body._id)
    .then((data) => {
      let newChild = {};
      for (prop of ["_id", "fullName", "age", "address", "__v"]) {
        newChild[prop] = request.body[prop] || data[prop];
      }

      for (prop of ["city", "street", "building"]) {
        newChild["address"][prop] =
          request.body["address"][prop] || data["address"][prop];
      }
      return newChild;
    })
    .then((data) => {
      Child.findByIdAndUpdate(request.body._id, data, { new: true })
        .then((data) => {
          if (!data) throw new Error("No Children exist by this ID");
          response.status(200).json(data);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
};

exports.deleteChildById = function (request, response, next) {
  Child.findByIdAndDelete(request.body._id)
    .then((data) => {
      if (!data) throw new Error("No Children exist by this ID");
      // response.status(200).json(data);
      return data;
    })
    .then((deletedChild) => {
      Class.updateMany(
        { children: request.body._id },
        { $pull: { children: request.body._id } },
        { new: true }
      )
        .then(() => {
          response.status(200).json({
            message: "the child has deleted and Classes updated successfully",
          });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
};

exports.getChildClassInfo = function (request, response, next) {
  Class.find({ children: request.params.id }, { children: 0, __v: 0 })
    .populate([
      { path: "children" },
      { path: "supervisor", select: { fullName: 1, _id: 0 } },
    ])
    .then((data) => {
      if (data.length == 0) throw new Error("No Teachers exist");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};
