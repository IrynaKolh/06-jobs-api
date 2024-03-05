const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllProducts = async (req, res) => {
  res.send("Get all products");
};

const getProductById = async (req, res) => {
  res.send("Get product by id");
};

const createProduct = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const product = await Product.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ product });
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
