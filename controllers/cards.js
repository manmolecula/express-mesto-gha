const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then(card => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => card ? res.send({ message: 'Карточка удалена!' }) : res.status(404).send({ message: 'Карточка по указанному id не найдена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Карточка по указанному id не найдена' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then(card => card ? res.send({ data: card }) : res.status(404).send({ message: 'Карточка не найдена' }))
  .catch((err) => {
    console.log(err.name);
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный id карточки' });
    }
    return res.status(500).send({ message: err.message });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then(card => card ? res.send({ data: card }) : res.status(404).send({ message: 'Карточка не найдена' }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный id карточки' });
    }
    return res.status(500).send({ message: err.message });
  });