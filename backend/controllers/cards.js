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
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res) => {
  const id = req.params.cardId;
  return cardSchema.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Нет карточки" });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Неверный id краточки` });
      }
      res.status(500).send({ message: `Ошибка сервера` });
    })
}

const likeCard = (req, res) => {
  return cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card){
      res.status(404).send({ message: "Нет карточки" });
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
       res.status(400).send({ message: 'Неверный id краточки' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
    }
  });
}

const dislikeCard = (req, res) => {
  return cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      res.status(404).send({ message: "Нет карточки" });
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Неверный id краточки' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
    }
  });
}

module.exports = {
  getCards,
  postCards,
  deleteCard,
  likeCard,
  dislikeCard
};
