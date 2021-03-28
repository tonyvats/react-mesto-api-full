const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { 
  getCards,
  postCards, 
  deleteCard,
  likeCard,
  dislikeCard
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/cards', auth, getCards);

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

const validateCardId = celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().required().length(24),
    }).unknown(true),
  });

router.get('/cards', auth, getCards);
router.post('/cards', auth, validateCard, postCards);
router.delete('/cards/:cardId', auth, validateCardId, deleteCard);
router.put('/cards/:cardId/likes', auth, likeCard);
router.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = router;
