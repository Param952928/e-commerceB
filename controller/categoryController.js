const Category = require("../models/category");
const fs = require("fs");
const uploadFile = require("../helper");
const { type } = require("os");
const { category } = require("../models");

module.exports = {
  createCategory: async (req, res) => {
    try {
      await uploadFile(req, res);
      // console.log("req.file", req);
      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }

      const { title, description, status, type, subType } = req.body;

      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      const newCategory = await Category.create({
        title,
        description,
        image: req.file?.originalname || null,
        status: status || "Active",
        type,
        subType,
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

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      console.log("host : ", process.env.HOST);
      const baseUrl = `http://${process.env.HOST}:4000/uploads`;
      const categoriesWithImageUrl = categories.map((category) => {
        if (category.image) {
          category.image = `${baseUrl}/${category.image}`;
        }
        return category;
      });
      res
        .status(200)
        .json({
          message: "Categories retrieved successfully",
          categories: categoriesWithImageUrl,
        });
    } catch (error) {
      console.error("Error retrieving categories:", error);
      res.status(500).json({ message: "Failed to retrieve categories" });
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
