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
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const id = req.params.cardId;

  return cardSchema.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет');
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы можете удалять только свои карточки');
      }

      cardSchema.findByIdAndDelete(req.params.cardId)
        .then((deletedCard) => res.status(200).send(deletedCard));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  cardSchema.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет');
      }

      cardSchema.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      )
        .then((updatedCard) => {
          res.status(200).send(updatedCard);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new BadRequestError('Введен невалидный id карточки');
          }
        });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  cardSchema.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет');
      }
      cardSchema.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      )
        .then((updatedCard) => {
          res.status(200).send(updatedCard);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new BadRequestError('Введен невалидный id карточки');
          }
        });
    })
    .catch(next);
};

module.exports = {
  getCards,
  postCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
