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

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((url) => {
      if (!validator.isURL(url)) {
        throw new CelebrateError('Неверный URL');
      }
      return url;
    }),
  }),
});

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getUserMe);
router.get('/users/:_id', auth, validateId, getUserById);
router.patch('/users/me', auth, validateUserUpdate, updateUser);
router.patch('/users/me/avatar', auth, validateUserAvatar, updateAvatar);

module.exports = router;

