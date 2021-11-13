const express = require('express');
const app = express();
const createError = require('http-errors');
const userRouter = require('./Routes/user.route');
// require('./helpers/connections_mongodb');
require('dotenv').config();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.send('Home page');
});

app.use('/user', userRouter);

app.use((req, res, next) => {
  next(createError.NotFound(`This route dose not exist.`));
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log('app listen on port ', PORT);
})