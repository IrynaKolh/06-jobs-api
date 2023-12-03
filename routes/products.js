const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

router.route("/").post(createProduct).get(getAllProducts);
router
  .route("/:id")
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
