const Mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const { all } = require('../app');
const APIFeatures = require('./../utils/apiFeatures');

const topCheapTours = (req, res, next) => {
  req.query.sort = 'rating,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  req.query.limit = '5';
  next();
};

const getAllTours = async (req, res) => {
  try {
    // Build Query
    // 1. Fitering
    // const queryObj = { ...req.query };
    // const excludedFields = ['sort', 'page', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(
    //   /\b(gt|lt|ne|lte|gte)\b/g,
    //   (match) => `$${match}`
    // );
    // let query = Tour.find(JSON.parse(queryStr));

    // 2. Sorting
    // if (req.query.sort) {
    //   let sort = req.query.sort;
    //   sort = sort.replace(/,/g, ' ');
    //   console.log(sort);
    //   query = query.sort(sort);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // Field Limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   console.log(fields);
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // Pagination

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);
    // if (req.query.page) {
    //   const numDocuments = await Tour.countDocuments();
    //   if (skip >= numDocuments) {
    //     throw new Error('More than allowed has been skipped ');
    //   }
    // }

    // Execute Query
    const features = new APIFeatures(Tour.find(), req.query)
      .sorting()
      .filtering()
      .limiting()
      .pagination();
    const allTours = await features.query;

    // Send Response
    res.status(200).json({
      status: 'success',
      length: allTours.length,
      data: {
        Tours: allTours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      error: err,
    });
  }
};

const getTour = async (req, res) => {
  console.log('id');
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail !!!!!',
      error: err,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    console.log('ok create');
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent!!!',
      error: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail!!',
      error: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'successful deleted',
      deletedData: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail !!',
      Error: err,
    });
  }
};

const getTourStatastics = async (req, res) => {
  try {
    const tourStatastics = await Tour.aggregate([
      {
        $match: { ratingsAvarage: { $gte: 4 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAvarage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: -1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      tourStatastics,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      error: err,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year;
    const monthlyPlan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-1-1`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numTourStarts: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan: monthlyPlan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      error: err,
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  topCheapTours,
  getTourStatastics,
  getMonthlyPlan,
};
