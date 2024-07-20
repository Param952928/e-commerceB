const product = require("../models/products");
const uploadFile = require("../helper");
module.exports = {
  createProduct: async (req, res) => {
    try {
      await uploadFile(req, res);
      console.log("body :", Object.keys(req.body), req.body);
      if (Object.keys(req.body).length !== 0) {
        const { title, description, category, price } = req.body;
        const newProduct = await product.create({
          title,
          description,
          image: req.file?.originalname || null,
          category,
          price,
        });
        res.status(200).json({
          message: "Product created successfully",
          product: newProduct,
        });
      } else {
        res.status(400).json({
          message: "Body data is required",
          product: {},
        });
      }
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).send("Failed to create product");
    }
  },

  getProduct: async (req, res) => {
    try {
      const { category } = req.query;
      const skip = req.body.skip || 0;
      const limit = req.body.limit || 10;
      let whereClause = {};
      console.log("category", category);
      if (category) {
        if (category.main && category.sub) {
          whereClause = {
            category: {
              main: category.main,
              sub: category.sub,
            },
          };
        } else if (category.main) {
          whereClause = {
            category: {
              main: category.main,
            },
          };
        }
      }
      console.log("whereClause", whereClause);
      const products = await product.findAll({
        where: whereClause,
        offset: parseInt(skip),
        limit: parseInt(limit),
      });
      const baseUrl = `http://${process.env.HOST}:4000/uploads`;
      const productsWithImageUrl = products.map((product) => {
        if (product.image) {
          product.image = `${baseUrl}/${product.image}`;
        }
        return product;
      });
      //   console.log("products", products);
      res.status(200).json({
        message: "Products retrieved successfully",
        products: productsWithImageUrl,
      });
    } catch (error) {
      console.error("Error retrieving products:", error);
      res.status(500).send("Failed to retrieve products");
    }
  },

  updateProduct: async (req, res) => {
    try {
      console.log("body :", req.body);

      const productId = req.params.id;
      console.log("productId", productId);
      const { title, description, category, price } = req.body;

      // Check if the product exists
      const existingProduct = await product.findByPk(productId);
      if (!existingProduct) {
        return res.status(404).json({
          message: "Product not found",
          productId: productId,
        });
      }

      // Update the product
      const updatedProduct = await product.update(
        { title, description, category, price },
        { where: { id: productId } }
      );

      if (updatedProduct[0] === 1) {
        res.status(200).json({
          message: "Product updated successfully",
          productId: productId,
        });
      } else {
        res.status(500).json({
          message: "Failed to update product",
          productId: productId,
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Failed to update product");
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      console.log("productId", productId);

      // Check if the product exists
      const existingProduct = await product.findByPk(productId);
      if (!existingProduct) {
        return res.status(404).json({
          message: "Product not found",
          productId: productId,
        });
      }

      // Delete the product
      const deletedProduct = await product.destroy({
        where: { id: productId },
      });
      console.log("deletedProduct", deletedProduct);
      if (deletedProduct === 1) {
        res.status(200).json({
          message: "Product deleted successfully",
          productId: productId,
        });
      } else {
        res.status(500).json({
          message: "Failed to delete product",
          productId: productId,
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("Failed to delete product");
    }
  },
};
