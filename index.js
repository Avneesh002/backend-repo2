const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const { userRouter } = require("./Routes/users.routes");
const { postRouter } = require("./Routes/posts.routes");
const { authentication } = require("./Middlewares/authentication.middleware");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ msg: "Homepage" });
});

app.use("/users", userRouter);
app.use(authentication);
app.use("/posts", postRouter);

app.listen(process.env.PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Server running on port ${process.env.PORT} and connected to db`
    );
  } catch (error) {
    console.log(error);
  }
});
