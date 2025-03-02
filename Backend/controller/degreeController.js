import express from 'express';
import Degree from "../schema/degree.js";

// Controller to add a new degree
export const addDegree = async (req, res) => {
  const { department, courseType, courseName } = req.body;

  // Check for uniqueness
  const existingDegree = await Degree.findOne({
    department,
    courseType,
    courseName,
  });

  if (existingDegree) {
    return res.status(400).json({ message: 'This degree already exists.' });
  }

  // Create a new degree
  const newDegree = new Degree({
    department,
    courseType,
    courseName,
  });

  try {
    await newDegree.save();
    res.status(201).json({ message: 'Degree added successfully', degree: newDegree });
  } catch (error) {
    console.error('Error saving degree:', error);
    res.status(500).json({ message: 'Failed to save degree. Please try again.' });
  }
};

// Controller to get all degrees
export const getDegrees = async (req, res) => {
  try {
    const degrees = await Degree.find();
    res.status(200).json(degrees);
  } catch (error) {
    console.error('Error fetching degrees:', error);
    res.status(500).json({ message: 'Failed to fetch degrees. Please try again.' });
  }
};

export const updateDegree = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDegree = await Degree.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDegree) {
      return res.status(404).json({ message: "Degree not found." });
    }
    res.status(200).json({ message: "Degree updated successfully", degree: updatedDegree });
  } catch (error) {
    res.status(500).json({ message: "Failed to update degree." });
  }
};

// Delete a degree
export const deleteDegree = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDegree = await Degree.findByIdAndDelete(id);
    if (!deletedDegree) {
      return res.status(404).json({ message: "Degree not found." });
    }
    res.status(200).json({ message: "Degree deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete degree." });
  }
};

// In your degreeController.js
export const getCoursesByDepartmentAndType = async (req, res) => {
  console.log(req.query)
  const { department, courseType } = req.query;

  try {
    const courses = await Degree.find({ department, courseType });
    res.status(200).json(courses);

    console.log(courses)
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
};