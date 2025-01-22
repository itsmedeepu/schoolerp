const ClassModel = require("../models/ClassModel");
const {
  ValidationError,
  DuplicateError,
  NotFoundError,
} = require("../utils/Errors");

const AddClass = async (req, res) => {
  const { classname } = req.body;

  // Check for missing classname
  if (!classname) {
    throw new ValidationError(400, "Classname is required");
  }

  // Check for duplicate class
  const existingClass = await ClassModel.findOne({ classname });
  if (existingClass) {
    throw new DuplicateError(409, "Class already exists");
  }

  // Save new class
  const newClass = new ClassModel({ classname });
  const savedClass = await newClass.save();

  res.status(201).json({
    message: "Class added successfully",
    data: savedClass,
  });
};

const GetClass = async (req, res) => {
  const allClasses = await ClassModel.find({});
  res.status(200).json({
    message: "All classes fetched successfully",
    data: allClasses,
  });
};

const GetClassById = async (req, res) => {
  const classid = req.params.classid;
  const classs = await ClassModel.findOne({ _id: classid });
  if (!classs) {
    throw NotFoundError(404, "class not found with this id");
  }
  return res.status(200).json({ message: "class fetched by id", data: classs });
};

const DeleteClass = async (req, res) => {
  const classid = req.params.classid;
  const allClasses = await ClassModel.findOne({ _id: classid });
  if (!allClasses) {
    throw new NotFoundError(404, "class not found with this id");
  }
  const deleteclass = await ClassModel.deleteOne({ _id: classid });
  res.status(200).json({
    message: "class deleted sucessfully",
    data: allClasses,
  });
};

module.exports = { AddClass, GetClass, DeleteClass, GetClassById };
