require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

const userRouter = require("./routes/user");

app.use("/api", userRouter);
app.listen(port, console.log(`Server listening at port ${port}`));
