const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  topCheapTours,
  getTourStatastics,
  getMonthlyPlan,
  // checkID,
  // checkBody,
} = require(`${__dirname}/../controllers/tourController`);
const authContruler = require('./../controllers/authController');

router.route('/top-cheap-5').get(topCheapTours, getAllTours);
router.route('/getTourStatastics').get(getTourStatastics);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
// router.param('id', checkID);
router.route(`/`).get(authContruler.protect, getAllTours).post(createTour);
router.route(`/:id`).get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
