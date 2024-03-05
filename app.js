require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
const connectDb = require("./db/connect");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const authMiddleware = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages
// If you are behind a proxy/load balancer (usually the case with most hosting services,
//  e.g. Heroku, Bluemix, AWS ELB, Nginx, Cloudflare, Akamai, Fastly, Firebase Hosting, Rackspace LB, Riverbed Stingray, etc.), 
// the IP address of the request might be the IP of the load balancer/reverse proxy 
// (making the rate limiter effectively a global one and blocking all requests once the limit is reached) or undefined.
// To solve this issue, please follow the steps given below.
app.set("trust proxy", 1);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
// routes
app.get("/", (req, res) => {
  res.send("products api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", authMiddleware, productsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT ? process.env.PORT : 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
