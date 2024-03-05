const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getProductById = async (req, res) => {
  const {
    user: { userId },
    params: { id: productId },
  } = req;
  const product = await Product.findOne({
    _id: productId,
    createdBy: userId,
  });
  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const createProduct = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const product = await Product.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ product });
};

const updateProduct = async (req, res) => {
  const {
    body: { name, price, description, type },
    user: { userId },
    params: { id: productId },
  } = req;

  if (!name || !price || !description || !type) {
    throw new BadRequestError("Please provide all values");
  }

  const product = await Product.findOneAndUpdate(
    { _id: productId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
  // res.send("Product has been successfully updated");
};

const deleteProduct = async (req, res) => {
   const {
     user: { userId },
     params: { id: productId },
   } = req;

   const product = await Product.findOneAndRemove({
     _id: productId,
     createdBy: userId,
   });
   if (!product) {
     throw new NotFoundError(`No product with id: ${productId}`);
   }
   res
     .status(StatusCodes.OK)
     .json({ msg: "Product has been successfully deleted" });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
