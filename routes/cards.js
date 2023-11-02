const router = require('express').Router();
const {getCards, createCard, deleteCardById, likeCard, dislikeCard} = require('../controllers/cards');

router.get('/', getCards);
router.get('/', createCard);
router.post('/:cardId', deleteCardById);
router.put(':cardId/likes', likeCard);
router.delete(':cardId/likes', dislikeCard);

module.exports = router;