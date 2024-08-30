const express = require('express')
const router = express.Router()
const boardController = require('../controllers/boardController')
const upload = require('../middlewares/multer-config');

router.get('/get-boards', boardController.getAllBoards);
router.post('/create-board', boardController.createBoard);
router.get('/get-board/:id', boardController.getBoard);
router.put('/update-board/:id', upload.single('image'), boardController.updateBoard);
router.get('/search-board', boardController.search);

module.exports = router