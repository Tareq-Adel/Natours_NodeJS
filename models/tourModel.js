const mongoose = require('mongoose');
const slugigy = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name.'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must have less or equal then 40 characters'],
      minlength: [10, 'Tour name must have more or equal then 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a dificulty'],
      enum: {
        values: ['easy', 'meadium', 'difficult'],
        message: 'Difficulty is either:easy, medium, difficult',
      },
    },
    ratingsAvarage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 1.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have price.'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        //this only points on current doc on New document creation.
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE})should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function () {
  this.slug = slugigy(this.name, { lower: true });
});

// tourSchema.pre('save', function () {
//   console.log(this);
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
