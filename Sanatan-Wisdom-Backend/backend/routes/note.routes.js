const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const { createNoteValidator, updateNoteValidator } = require('../validators/note.validator');
const { mongoIdParamValidator } = require('../validators/book.validator');

// All note routes require authentication
router.use(verifyJWT);

router.post('/', createNoteValidator, noteController.createNote);
router.get('/', noteController.getNotes);
router.put('/:id', mongoIdParamValidator('id'), updateNoteValidator, noteController.updateNote);
router.delete('/:id', mongoIdParamValidator('id'), noteController.deleteNote);

module.exports = router;
