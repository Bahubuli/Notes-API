const Note = require("../models/Note");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createNote = async (req,res,next) => {
  try {
    req.body.user = req.user.userId;
    const note = await Note.create(req.body);
    res.status(StatusCodes.CREATED).json({ note });
  } catch (error) {
    next(error);
  }
};

const getAllNote = async (req,res,next) => {
  try {
    const notes = await Note.find({$or: [
        { user: req.user.userId },
        { sharedWith: { $in: [req.user.userId] } },
      ]});
    res.status(StatusCodes.OK).json(notes);
  } catch (error) {
    next(error);
  }
};

const getSingleNote = async (req,res,next) => {
  try {
    const { id: noteId } = req.params;
    const note = await Note.findOne({ _id: noteId });
    if (!note)
      throw new CustomError.NotFoundError(
        `Not with given id ${noteId} doesn't exist`
      );

    res.status(StatusCodes.OK).json({ note });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req,res,next) => {
  try {
    const { id: noteId } = req.params;
    const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (note.user.toString() !== req.user.userId) {
        throw new CustomError.UnauthorizedError('Permission denied');
      }
    if (!note)
      throw new CustomError.NotFoundError("No note with id: " + noteId);

    res.status(StatusCodes.OK).json({ note });
  } catch (error) {
    next(error);
  }
};
const deleteNote = async (req,res,next) => {
  try {
    const { id: noteId } = req.params;
    const note = await Note.findOne({ _id: noteId });

    if (note.user.toString() !== req.user.userId) {
        throw new CustomError.UnauthorizedError('Permission denied');
      }

    await note.remove();
    res.status(StatusCodes.OK).json({ msg: "note is deleted" });
  } catch (error) {
    next(error);
  }
};

const shareNote = async (req, res, next) => {
    try {
      const { id: noteId } = req.params;
      const userId = req.body.userId;
      const note = await Note.findOne({ _id: noteId });

      if (!note) {
        throw new CustomError.NotFoundError("No note with id: " + noteId);
      }

      if (note.user.toString() !== req.user.userId) {
        throw new CustomError.ForbiddenError('Permission denied');
      }


      if (userId === req.user.userId) {
        throw new CustomError.ForbiddenError('You cannot share the note with yourself');
      }


      if (note.sharedWith.includes(userId)) {
        throw new CustomError.ForbiddenError('Note is already shared with this user');
      }

      note.sharedWith.push(userId);
      await note.save();

      res.send("Shared successfully");
    } catch (error) {
      next(error);
    }
  };

const searchNote = async(req,res,next)=>{
    try {

        const searchTerm = req.query.q || ''; // Get the search term from query parameters
    const notes = await Note.find(
      {
        $and: [
          {
            $or: [
              { user: req.user.userId }, // Owner condition
              { sharedWith: { $in: [req.user.userId] } }, // Shared condition
            ],
          },
          {
            $text: {
              $search: searchTerm,
            },
          },
        ],
      },
    )
    res.status(StatusCodes.OK).json(notes);
    } catch (error) {
        next(error);
    }
}

module.exports = {
  createNote,
  getAllNote,
  getSingleNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNote
};
