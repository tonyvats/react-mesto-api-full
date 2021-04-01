const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const BadRequestErr = require('../errors/BadRequestError');

const getUsers = (req, res, next) => userSchema.find({})
  .then((data) => res.send(data))
  .catch(next);

const getUserById = (req, res, next) => {
  userSchema.findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr('Введен невалидный id пользователя');
      }
      return next(err);
    })
    .catch(next);
};

const getUserMe = (req, res, next) => userSchema.findById(req.user._id)
  .catch(() => {
    throw new NotFoundError('Пользователь с таким id не найден');
  })
  .then((user) => res.send(user))
  .catch(next);

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  userSchema.findOne({ email })
    .then((user) => {
      if (!(user === null)) throw new ConflictError('Пользователь с таким email зарегестрирован');
    })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => userSchema.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new UnauthorizedError('Введены неверное имя или пароль'));
  }

  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError('Введены неверное имя или пароль')))
    .catch((next));
};

const updateUser = (req, res, next) => userSchema.findByIdAndUpdate(
  req.user._id,
  { name: req.body.name, about: req.body.about },
  { new: true, runValidators: true },
)
  .catch(() => {
    throw new NotFoundError('Пользователь с таким id не найден');
  })
  .then((user) => res.send(user))
  .catch(next);

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return userSchema.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .catch(() => {
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  getUserMe,
  updateUser,
  updateAvatar,
};
