const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: [true, 'Please provide The task title'],
    },
    description:{
        type:String,
        required:[true,"Please provide the task description"],
        minlength: 3,
        maxlength: 1000000,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    sharedWith:{
        type:[mongoose.Types.ObjectId],
        ref:'User'
    },
    dueDate:{
        type:Date
    },
    status:{
        type:String,
        default:"pending"
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TaskSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('Task', TaskSchema);
