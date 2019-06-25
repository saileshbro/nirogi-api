require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
const port = process.env.PORT || 3000;

const userRouter = require("./routes/user");
const diseaseRouter = require("./routes/disease");
const symptomRouter = require("./routes/symptom");
const postRouter = require("./routes/post");
const profileRouter = require("./routes/profile");
const tipsRouter = require("./routes/tips");
app.use("/api", userRouter);
app.use("/api", diseaseRouter);
app.use("/api", postRouter);
app.use('/api', profileRouter);
app.use('/api', symptomRouter);
app.use('/api', tipsRouter);
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});