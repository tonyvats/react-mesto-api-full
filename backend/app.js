/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users.js');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  celebrate,
  Joi,
} = require('celebrate');

const app = express();


const { PORT = 3000 } = process.env;

app.use(cors());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});


// const options = {  
//   origin: [    
//     'http://localhost:3000',
//     'http://vatc.nomoredomains.icu',
//     'http://api.vatc.nomoredomains.club',  
//     'https://vatc.nomoredomains.icu',
//     'https://api.vatc.nomoredomains.club'  
//   ],  
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],  
//   preflightContinue: false,  
//   optionsSuccessStatus: 204,  
//   allowedHeaders: ['Content-Type', 'origin', 'Authorization'],  
//   credentials: true,
// };

// app.use('*', cors(options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  },
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use('/', router);
app.use(errorLogger);

app.use((err, req, res, next) => {
  // console.log(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
