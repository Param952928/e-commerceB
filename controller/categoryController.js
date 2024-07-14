const Category = require("../models/category");
const fs = require("fs");
const upload = require("../helper");
const { type } = require("os");

module.exports = {
  createCategory: async (req, res) => {
    console.log("req : ", req)
        try {
          const { title, description, status, type, subType } = req.body;
  
          if (!title) {
            return res.status(400).json({ message: "Title is required" });
          }
    
          const newCategory = await Category.create({
            title,
            description,
            image : null,
            status: status || "Active",
            type,
            subType
          });
  
          res.status(200).json({
            message: "Category created successfully",
            category: newCategory,
          });
        } catch (error) {
          console.error("Error creating category:", error);
          res.status(500).json({ message: "Failed to create category" });
        }
  },

  getCategory: async (req, res) => {
    try {
      console.log("req :", req.params);
      const categoryId = req.params.id;
      const category = await Category.findByPk(categoryId);
      console.log("category", category);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res
        .status(200)
        .json({ message: "Category retrieved successfully", category });
    } catch (error) {
      console.error("Error retrieving category:", error);
      res.status(500).json({ message: "Failed to retrieve category" });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res
        .status(200)
        .json({ message: "Categories retrieved successfully", categories });
    } catch (error) {
      console.error("Error retrieving categories:", error);
      res.status(500).json({ message: "Failed to retrieve categories" });
    }
  },

  updateCategory: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      } else {
        try {
          const categoryId = req.params.id;
          const { title, description, status } = req.body;

          const category = await Category.findByPk(categoryId);
          if (!category) {
            return res.status(404).json({ message: "Category not found" });
          }

          let image = category.image;
          if (req.file) {
            image = fs.readFileSync(req.file.path);
          }

          await Category.update(
            { title, description, image, status },
            { where: { id: categoryId } }
          );

          res.status(200).json({ message: "Category updated successfully" });
        } catch (error) {
          console.error("Error updating category:", error);
          res.status(500).json({ message: "Failed to update category" });
        }
      }
    });
  },

  deleteCategory: async (req, res) => {
    try {
      const categoryId = req.params.id;

      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      await Category.destroy({ where: { id: categoryId } });

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  },
};
