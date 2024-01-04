const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: [true, 'Please provide The Note'],
    },
    body:{
        type:String,
        required:[true,"Please provide the note body"],
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
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

NoteSchema.index({ title: 'text', body: 'text' });
module.exports = mongoose.model('Note', NoteSchema);
