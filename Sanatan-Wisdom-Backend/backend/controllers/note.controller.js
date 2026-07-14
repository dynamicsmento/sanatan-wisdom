const noteService = require('../services/note.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { STATUS_CODES } = require('../constants');

const createNote = asyncHandler(async (req, res) => {
  const { book, chapter, content, isPrivate } = req.body;
  const note = await noteService.createNote(req.user._id, {
    book,
    chapter,
    content,
    isPrivate
  });

  res.status(STATUS_CODES.CREATED).json(
    new ApiResponse(STATUS_CODES.CREATED, { note }, 'Note created successfully')
  );
});

const getNotes = asyncHandler(async (req, res) => {
  const { book, chapter, page, limit } = req.query;
  const result = await noteService.getNotes(req.user._id, { book, chapter, page, limit });

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, result, 'Notes retrieved successfully')
  );
});

const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, isPrivate } = req.body;
  
  const note = await noteService.updateNote(id, req.user._id, { content, isPrivate });

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, { note }, 'Note updated successfully')
  );
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await noteService.deleteNote(id, req.user._id);

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, null, 'Note deleted successfully')
  );
});

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote
};
