const express = require('express');
const createError = require('http-errors');
const route = express.Router();
const User = require('../Models/user.model');
const {userValidate} = require('../helpers/validation');

route.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // if (!email || !password) {
    //   throw createError.BadRequest();
    // }
    const {error} = userValidate(req.body);
    if(error){
      throw createError(error.details[0].message);
    }
    console.log('error..', error);

    const isExist = await User.findOne({ email });

    if (isExist) {
      throw createError.Conflict(`${email} is already register`);
    }
    const newUser = new User({ email, password });
    const saveUSer = await newUser.save();

    return res.json({
      status: 'OK',
      elements: saveUSer
    })

  } catch (error) {
    next(error);
  }
});

route.post('/refresh-token', async (req, res, next) => {
  res.send('refresh-toke');
});

route.post('/login', async (req, res, next) => {
  try {
    const {error} = userValidate(req.body);
    const {email, password} = req.body;

    if(error){
      throw createError(error.details[0].message);
    }
    const user = await User.findOne({email});
    if(!user){
      throw createError.NotFound('User is not register yet');
    }

    const isValid = await user.isCheckPassword(password);
    if(!isValid){
      throw createError.Unauthorized();
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
  
});

route.post('/logout', (req, res, next) => {
  res.send('logout');
});

module.exports = route;