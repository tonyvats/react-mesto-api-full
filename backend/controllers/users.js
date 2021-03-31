const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => {
  return userSchema.find({})
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const getUserById = (req, res, next) => {
  return userSchema.findById(req.params.id)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};
const getUserMe = (req, res, next) => {
  return userSchema.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10, (error, hash) => {
    return userSchema.findOne({ email })
      .then((user) => {
        if (user) return next(new ConflictError('Пользователь уже существует'));
        return userSchema.create({
          name, about, avatar, email, password: hash,
        })
          .then((newUser) => res.status(200).send(newUser));
      })
      .catch(next);
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, 
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', 
        { expiresIn: '7d' }
      );
      res.send({ token });
    })
    .catch(next);
};

const updateUser = (req, res) => {
  return userSchema.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(400).send({ message: 'Ошибка при обновлении' }));
}

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return userSchema.findByIdAndUpdate(
    req.user._id, 
    { avatar }, 
    { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      console.log(err)
     next(err)
   })
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  getUserMe,
  updateUser,
  updateAvatar
};
