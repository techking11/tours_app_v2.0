const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review is required !'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    select: 'name',
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    select: 'name photo',
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
