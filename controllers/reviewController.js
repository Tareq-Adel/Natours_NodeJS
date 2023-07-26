const catchAsync = require('./../utils/catchAsync');
const Review = require('./../models/reviewModel');

exports.createReview = catchAsync(async (req, res, next) => {
  const reviewText = req.body.review.trim();

  const newReview = await Review.create({
    review: reviewText,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.body.user,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});
