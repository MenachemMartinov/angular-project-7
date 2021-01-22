const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");

const router = require("express").Router();

router.post("/loginUser", async (req, res) => {
  // validate body
  console.log(req.header("my-auth-token"));
  console.log(req.header("Content-Type"));

  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // does user exist
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  user.generateAuth;
  // validate password
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    return res.status(400).send("Invalid email or password");
  }

  // send the user a token
  res.send({ token: user.generateAuthToken(), user:_.pick(user, ["_id", "name", "email"]) });
});

function validate(data) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(data);
}

module.exports = router;
