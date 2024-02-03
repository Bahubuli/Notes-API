const express = require('express');
const router = express.Router();
const {
  authenticateUser
} = require('../middleware/authentication');

const {
    createTask,
    getAllTask,
    getSingleTask,
    updateTask,
    deleteTask,
    shareTask,
    searchTask,

} = require('../controllers/TaskController');


router
  .route('/')
  .post(authenticateUser,createTask)
  .get(authenticateUser,getAllTask);

router.route("/search")
.get(authenticateUser,searchTask)

router
  .route('/:id')
  .get(authenticateUser,getSingleTask)
  .patch(authenticateUser,updateTask)
  .delete(authenticateUser,deleteTask);

router
.route("/:id/share")
.post(authenticateUser,shareTask)



module.exports = router;
