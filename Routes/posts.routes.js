const express = require("express");
const postRouter = express.Router();
const { postModel } = require("../Models/post.model");
const DeviceDetector = require("node-device-detector");

postRouter.get("/", async (req, res) => {
  let page = req.query.page;
  page = (+page - 1) * 3;

  const ismarried = req.query.ismarried;
  if (ismarried) {
    const data = await postModel
      .find({ isMarried: ismarried })
      .limit(3)
      .skip(page);
    res.status(200).send({ msg: data });
  } else {
    const data = await postModel.find().limit(3).skip(page);
    res.status(200).send({ msg: data });
  }
});

postRouter.get("/top", async (req, res) => {
  console.log(req.query);
  let page = req.query.page;
  page = (+page - 1) * 3;
  const data = await postModel
    .find()
    .sort({ no_of_comments: "desc" })
    .limit(3)
    .skip(page);

  res.status(200).send({ msg: data });
});
postRouter.post("/add", async (req, res) => {
  const { title, body, user } = req.body;

  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });
  const userAgent = req.headers["user-agent"];
  const result = detector.detect(userAgent);

  try {
    const data = new postModel({
      title,
      body,
      device: result.os.name !== undefined ? result.os.name : "Desktop",
      no_of_comments: 0,
      user,
    });
    await data.save();
    res.status(200).send({ msg: "Post Added successfully" });
  } catch (error) {
    res.status(400).send({ error });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  const data = await postModel.find({ _id: id });

  if (data.length > 0 && data[0].user === user) {
    await postModel.findByIdAndUpdate({ _id: id }, req.body);

    res.status(200).send({ msg: "Post Updated Successfully" });
  } else {
    res.status(400).send({
      msg:
        data.length > 0
          ? "You are not Authorized"
          : "This Post is not available",
    });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  const data = await postModel.find({ _id: id });

  if (data.length > 0 && data[0].user === user) {
    await postModel.findByIdAndDelete({ _id: id });

    res.status(200).send({ msg: "Post Deleted Successfully" });
  } else {
    res.status(400).send({
      msg:
        data.length > 0
          ? "You are not Authorized"
          : "This Post is not available",
    });
  }
});

module.exports = { postRouter };
