const router = require('express').Router();
const categoryController = require('../controller/categoryController');

router.post('/create', categoryController.createCategory);
router.get('/get/:id', categoryController.getCategory);
router.get('/get-all-categories', categoryController.getAllCategories);
router.put('/update/:id', categoryController.updateCategory);
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;
