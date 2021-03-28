/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users.js');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  errors,
  celebrate,
  Joi,
  CelebrateError,
} = require('celebrate');

const app = express();
app.use(cors());

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string(),
    about: Joi.string(),
    avatar: Joi.string().custom((url) => {
      if (!validator.isURL(url)) {
        throw new CelebrateError('Неверный URL');
      }
      return url;
    }),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateUserLogin, login);
app.post('/signup', validateUserSignup, createUser);

app.use('/', router);
app.use(errorLogger);
const allowedCors = [
  'http://vlg.students.nomoredomains.rocks',
  'http://api.vlg.students.nomoredomains.rocks',
  'http://localhost:3001',
];
app.use(cors({
  origin: allowedCors,
}));
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
