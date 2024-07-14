const router = require("express").Router();
const productController = require("../controller/productController");

router.post("/create", productController.createProduct);
router.get("/get", productController.getProduct);
router.put("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
