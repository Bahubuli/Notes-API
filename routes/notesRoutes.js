const express = require('express');
const router = express.Router();
const {
  authenticateUser
} = require('../middleware/authentication');

const {
    createNote,
    getAllNote,
    getSingleNote,
    updateNote,
    deleteNote,
    shareNote,
    searchNote,

} = require('../controllers/noteController');


router
  .route('/')
  .post(authenticateUser,createNote)
  .get(authenticateUser,getAllNote);

router.route("/search")
.get(authenticateUser,searchNote)

router
  .route('/:id')
  .get(authenticateUser,getSingleNote)
  .put(authenticateUser,updateNote)
  .delete(authenticateUser,deleteNote);

router
.route("/:id/share")
.post(authenticateUser,shareNote)



module.exports = router;
