const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserById, 
  createUser, 
  login, 
  getUserMe,
  updateUser,
  updateAvatar
} = require('../controllers/users');

// const validateId = celebrate({
//   params: Joi.object().keys({
//     _id: Joi.string().alphanum().length(24),
//   }),
// });

// const validateUserUpdate = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     about: Joi.string().required().min(2).max(30),
//   }),
// });

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getUserMe);

router.get('/users/:_id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), getUserById);

router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
  }),
}), updateAvatar);

module.exports = router;

