const joi = require('joi');

const userValidate = data => {
  const userSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(4).max(32).required(),
  });

  return userSchema.validate(data);
};

module.exports = {userValidate};