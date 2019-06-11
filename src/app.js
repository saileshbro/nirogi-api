require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

const userRouter = require("./routes/user");
const diseaseRouter = require("./routes/disease");
app.use("/api", userRouter);
app.use("/api", diseaseRouter);
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
