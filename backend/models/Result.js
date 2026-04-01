const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    userId: {
  type: String,
  required: true,
},
    courseId: {
      type: Number,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    answers: [
      {
        questionId: Number,
        question: String,
        selectedAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
      },
    ],
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    status: {
      type: String,
      enum: ['passed', 'failed'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);
