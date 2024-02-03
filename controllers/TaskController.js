const Task = require("../models/Task");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createTask = async (req,res,next) => {
  try {
    req.body.user = req.user.userId;
    const task = await Task.create(req.body);
    res.status(StatusCodes.CREATED).json({ task });
  } catch (error) {
    next(error);
  }
};

const getAllTask = async (req,res,next) => {

    console.log(req.query)
    let tasks = Task.find({user:req.user.userId});
    let total = Task.find({user:req.user.userId})
    if(req.query._sort && req.query._order)
    tasks.sort({[req.query._sort]:req.query._order})

    if(req.query._page && req.query._limit)
    {
        const pageSize = +req.query._limit;
        const page = +req.query._page;
        tasks = tasks.skip(pageSize*(page-1)).limit(pageSize);
    }
    tasks = await tasks.exec();
    total = await total.exec();
    res.status(StatusCodes.OK).json({tasks, count:total.length})
};

const getSingleTask = async (req,res,next) => {
  try {
    const { id: TaskId } = req.params;
    const task = await Task.findOne({ _id: TaskId });
    if (!task)
      throw new CustomError.NotFoundError(
        `Not with given id ${TaskId} doesn't exist`
      );

    res.status(StatusCodes.OK).json(task );
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req,res,next) => {
  try {
    const { id: TaskId } = req.params;
    console.log(req.body)
    const task = await Task.findOneAndUpdate({ _id: TaskId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (task.user.toString() !== req.user.userId) {
        throw new CustomError.UnauthorizedError('Permission denied');
      }
    if (!task)
      throw new CustomError.NotFoundError("No Task with id: " + TaskId);


    res.status(StatusCodes.OK).json( task );
  } catch (error) {
    next(error);
  }
};
const deleteTask = async (req,res,next) => {
  try {
    const { id: TaskId } = req.params;
    const task = await Task.findOne({ _id: TaskId });

    if (task.user.toString() !== req.user.userId) {
        throw new CustomError.UnauthorizedError('Permission denied');
      }

    await task.remove();

    let tasks = Task.find({user:req.user.userId});
    let total = Task.find({user:req.user.userId})
    if(req.query._sort && req.query._order)
    tasks.sort({[req.query._sort]:req.query._order})

    if(req.query._page && req.query._limit)
    {
        const pageSize = +req.query._limit;
        const page = +req.query._page;
        tasks = tasks.skip(pageSize*(page-1)).limit(pageSize);
    }
    tasks = await tasks.exec();
    total = await total.exec();
    res.status(StatusCodes.OK).json({tasks, count:total.length})
  } catch (error) {
    next(error);
  }
};

// todo
const shareTask = async (req, res, next) => {
    try {
      const { id: TaskId } = req.params;
      const userId = req.body.userId;
      const task = await Task.findOne({ _id: TaskId });

      if (!task) {
        throw new CustomError.NotFoundError("No Task with id: " + TaskId);
      }

      if (task.user.toString() !== req.user.userId) {
        throw new CustomError.ForbiddenError('Permission denied');
      }


      if (userId === req.user.userId) {
        throw new CustomError.ForbiddenError('You cannot share the Task with yourself');
      }


      if (task.sharedWith.includes(userId)) {
        throw new CustomError.ForbiddenError('Task is already shared with this user');
      }

      task.sharedWith.push(userId);
      await task.save();

      res.send("Shared successfully");
    } catch (error) {
      next(error);
    }
  };

// todo
const searchTask = async(req,res,next)=>{
    try {

        const searchTerm = req.query.q || ''; // Get the search term from query parameters
    const tasks = await Task.find(
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
    res.status(StatusCodes.OK).json(tasks);
    } catch (error) {
        next(error);
    }
}

module.exports = {
  createTask,
  getAllTask,
  getSingleTask,
  updateTask,
  deleteTask,
  shareTask,
  searchTask
};
