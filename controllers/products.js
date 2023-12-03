const getAllProducts = async (req, res) => {
  res.send("Get all products");
};

const getProductById = async (req, res) => {
  res.send("Get product by id");
};

const createProduct = async (req, res) => {
  res.send("Product has been successfully created");
};

const updateProduct = async (req, res) => {
  res.send("Product has been successfully updated");
};

const deleteProduct = async (req, res) => {
  res.send("Product has been successfully deleted");
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
