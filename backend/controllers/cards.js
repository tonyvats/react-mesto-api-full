const cardSchema = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  cardSchema.find()
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточки не найдены');
      } else {
        res.send(cards);
      }
    })
    .catch(next);
};

const postCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema.create({ name, link, owner })
    .catch(() => {
      throw new BadRequestError('Переданы некорректные данные');
    })
    .then((card) => res.send(card))
    .catch(next)
};

const deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  return cardSchema.findByIdAndRemove(id)
    .catch(() => {
      throw new NotFoundError('Такой карточки нет');
    })
    .then((card) => res.send(card))
    .catch(next)
}

const likeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .catch(() => {
      throw new NotFoundError('Такой карточки нет');
    })
    .then((card) => res.send(card))
    .catch(next)
}

const dislikeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .catch(() => {
      throw new NotFoundError('Такой карточки нет');
    })
    .then((card) => res.send(card))
    .catch(next)
}

module.exports = {
  getCards,
  postCards,
  deleteCard,
  likeCard,
  dislikeCard
};
